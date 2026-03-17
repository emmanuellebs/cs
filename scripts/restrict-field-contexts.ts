/**
 * Restringe todos os contextos dos campos definidos em fieldsConfig.ts
 * para o projeto CSM, removendo associação em outros projetos.
 *
 * Uso:
 *   JIRA_BASE_URL=https://whd.atlassian.net
 *   JIRA_EMAIL=...
 *   JIRA_API_TOKEN=...
 *   JIRA_PROJECT_KEY=CSM
 *   npm run restrict:contexts
 *
 * Opcional: DRY_RUN=true para apenas logar o que seria alterado.
 *
 * Atenção: isso remove os campos de outros projetos nos contextos existentes.
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { loadFieldsProvisionConfig } from '../src/config/fieldsConfig';

dotenv.config();

const {
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY,
  DRY_RUN,
} = process.env;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
  console.error('Faltam variáveis: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY');
  process.exit(1);
}

const dryRun = (DRY_RUN ?? '').toLowerCase() === 'true';

const client = axios.create({
  baseURL: `${JIRA_BASE_URL.replace(/\/+$/, '')}/rest/api/3`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

async function getProjectId(projectKey: string): Promise<string> {
  const resp = await client.get(`/project/${encodeURIComponent(projectKey)}`);
  return resp.data.id;
}

async function listFields() {
  const resp = await client.get('/field');
  return resp.data as Array<{ id: string; name: string }>;
}

async function listContexts(fieldId: string) {
  const resp = await client.get(`/field/${encodeURIComponent(fieldId)}/context`);
  return resp.data.values as Array<{
    id: string;
    name: string;
    description?: string;
    projectIds?: string[];
    issueTypeIds?: string[];
  }>;
}

async function updateContext(fieldId: string, ctx: any, projectId: string) {
  if (dryRun) {
    console.info(`[DRY] Would update context ${ctx.id} of ${fieldId} to project ${projectId}`);
    return;
  }
  await client.put(`/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(ctx.id)}`, {
    name: ctx.name,
    description: ctx.description ?? '',
    projectIds: [String(projectId)],
    issueTypeIds: ctx.issueTypeIds && ctx.issueTypeIds.length ? ctx.issueTypeIds : [],
  });
  console.info(`[UPDATE] Context ${ctx.id} of ${fieldId} now scoped to project ${projectId}`);
}

async function createContext(fieldId: string, baseCtx: any, projectId: string) {
  if (dryRun) {
    console.info(`[DRY] Would create new context for ${fieldId} scoped to project ${projectId}`);
    return { id: 'dry', name: baseCtx?.name || 'Contexto CSM' };
  }
  const resp = await client.post(`/field/${encodeURIComponent(fieldId)}/context`, {
    name: baseCtx?.name || 'Contexto CSM',
    description: baseCtx?.description ?? '',
    projectIds: [String(projectId)],
    issueTypeIds: baseCtx?.issueTypeIds && baseCtx.issueTypeIds.length ? baseCtx.issueTypeIds : [],
  });
  const ctx = resp.data.values?.[0] ?? resp.data;
  console.info(`[CREATE] Context ${ctx.id} created for ${fieldId} scoped to ${projectId}`);
  return ctx;
}

async function listOptions(fieldId: string, contextId: string) {
  const resp = await client.get(
    `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(contextId)}/option`
  );
  return (resp.data.values || []) as Array<{ id: string; value: string }>;
}

async function createOptions(fieldId: string, contextId: string, values: string[]) {
  if (!values.length) return;
  if (dryRun) {
    console.info(
      `[DRY] Would create ${values.length} options in ctx ${contextId} for field ${fieldId}`
    );
    return;
  }
  await client.post(
    `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(contextId)}/option`,
    { options: values.map((v) => ({ value: v })) }
  );
  console.info(`[OPTIONS] ${values.length} options created in ctx ${contextId} for field ${fieldId}`);
}

async function deleteContext(fieldId: string, ctxId: string) {
  if (dryRun) {
    console.info(`[DRY] Would delete context ${ctxId} of field ${fieldId}`);
    return;
  }
  await client.delete(`/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(ctxId)}`);
  console.info(`[DELETE] Context ${ctxId} removed from field ${fieldId}`);
}

async function main() {
  const projectId = await getProjectId(JIRA_PROJECT_KEY!);
  const fieldConfig = loadFieldsProvisionConfig();
  const jiraFields = await listFields();
  const byName = new Map(jiraFields.map((f) => [f.name, f.id]));

  for (const cfg of fieldConfig.fields) {
    const fieldId = byName.get(cfg.name);
    if (!fieldId) {
      console.warn(`[SKIP] Campo não encontrado no Jira: ${cfg.name}`);
      continue;
    }

    let contexts: any[] = [];
    try {
      contexts = await listContexts(fieldId);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        console.warn(`[SKIP] Campo ${cfg.name} (${fieldId}) não encontrado ao listar contextos.`);
        continue;
      }
      throw err;
    }
    if (!contexts.length) {
      console.warn(`[SKIP] Campo ${cfg.name} sem contextos retornados.`);
      continue;
    }

    // Se já existe contexto exclusivo do projeto, usar e eliminar demais
    const scoped = contexts.find(
      (c) => (c.projectIds || []).length === 1 && String(c.projectIds[0]) === String(projectId)
    );

    // Mantemos options do primeiro contexto como fonte (se select)
    const sourceCtx = contexts[0];
    let sourceOptions: string[] = [];
    if (cfg.kind === 'select' && sourceCtx?.id) {
      try {
        const opts = await listOptions(fieldId, sourceCtx.id);
        sourceOptions = opts.map((o) => o.value);
      } catch (err: any) {
        console.warn(`[WARN] Não foi possível ler opções de ${cfg.name}`, err?.response?.data || err.message);
      }
    }

    // Remover todos os contextos atuais
    for (const ctx of contexts) {
      console.info(
        `[PLAN] Remover contexto ${ctx.id} de ${cfg.name} (projects=${(ctx.projectIds || []).join(',') || 'global'})`
      );
      try {
        await deleteContext(fieldId, ctx.id);
      } catch (err: any) {
        const status = err?.response?.status;
        console.error(
          `[ERROR] Falha ao remover contexto ${ctx.id} do campo ${cfg.name} (status ${status ?? ''})`,
          err?.response?.data || err.message
        );
      }
    }

    // Criar novo contexto exclusivo do projeto
    const newCtx = await createContext(fieldId, sourceCtx, projectId);
    if (cfg.kind === 'select' && sourceOptions.length && newCtx?.id) {
      await createOptions(fieldId, newCtx.id, sourceOptions);
    }

    console.info(`[OK] Campo ${cfg.name} agora com contexto apenas do projeto ${projectId}`);
  }

  console.info('Concluído.');
}

main().catch((err) => {
  console.error('Erro ao restringir contextos:', err.response?.data || err.message);
  process.exit(1);
});
