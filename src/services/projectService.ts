import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';
import { loadProjectProvisionConfig } from '../config/projectConfig';
import { ProvisioningItemResult } from '../utils/types';

const logger = new Logger({ module: 'projectService' });

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

export async function findProjectByKey(key: string): Promise<JiraProject | null> {
  try {
    const response = await jiraClient.request<JiraProject>({
      url: `/project/${encodeURIComponent(key)}`,
      method: 'GET',
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function ensureProject(): Promise<ProvisioningItemResult> {
  const { jira, projectTemplateKey, projectTypeKey } = loadProjectProvisionConfig();
  logger.info(`Verificando existência do projeto ${jira.projectKey}...`);

  const existing = await findProjectByKey(jira.projectKey);
  if (existing) {
    logger.info(`Projeto encontrado: ${existing.key} (${existing.id})`);
    return {
      key: 'project',
      name: existing.name,
      status: 'reused',
      jiraId: existing.id,
      jiraKey: existing.key,
      details: 'Projeto já existente foi reutilizado.',
    };
  }

  logger.info(
    `Projeto não encontrado. Tentando criar projeto ${jira.projectKey} - ${jira.projectName}...`
  );

  const mode = jiraClient.getMode();

  // Em modo audit/dry-run, não devemos sequer simular criação.
  if (mode.mode === 'audit' || mode.dryRun) {
    logger.info(
      `Projeto ${jira.projectKey} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`
    );
    return {
      key: 'project',
      name: jira.projectName,
      status: 'skipped',
      details:
        'Projeto não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado automaticamente (se permitido).',
    };
  }

  try {
    const body: any = {
      key: jira.projectKey,
      name: jira.projectName,
      projectTypeKey,
      projectTemplateKey,
    };

    if (jira.projectLeadAccountId) {
      body.leadAccountId = jira.projectLeadAccountId;
    }

    const response = await jiraClient.request<JiraProject>({
      url: '/project',
      method: 'POST',
      data: body,
    });

    const created = response.data;
    logger.info(`Projeto criado com sucesso: ${created.key} (${created.id}).`);

    return {
      key: 'project',
      name: created.name,
      status: 'created',
      jiraId: created.id,
      jiraKey: created.key,
      details: `Projeto criado via API com template ${projectTemplateKey}.`,
    };
  } catch (error: any) {
    logger.error('Falha ao criar projeto via API. Projeto deverá ser criado manualmente.', error);
    return {
      key: 'project',
      name: jira.projectName,
      status: 'manual',
      details:
        'Não foi possível criar o projeto via API. Crie manualmente no Jira e reexecute em modo audit/apply.',
      error: error?.message,
      warnings: [
        'Verifique permissões de administrador de projeto e se o template informado está disponível.',
      ],
    };
  }
}

