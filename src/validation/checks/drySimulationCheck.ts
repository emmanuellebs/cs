import { findProjectByKey } from '../../services/projectService';
import { loadIssueTypesProvisionConfig } from '../../config/issueTypesConfig';
import { loadFieldsProvisionConfig } from '../../config/fieldsConfig';
import { loadFiltersProvisionConfig } from '../../config/filtersConfig';
import { loadBoardProvisionConfig } from '../../config/boardConfig';
import { loadDashboardsProvisionConfig } from '../../config/dashboardsConfig';
import { loadProjectProvisionConfig } from '../../config/projectConfig';
import { jiraClient } from '../../clients/jiraClient';
import { agileClient } from '../../clients/agileClient';
import { ValidationCheckResult } from '../types';

type SimulationOutcome =
  | 'would_reuse'
  | 'would_create'
  | 'would_skip'
  | 'would_require_manual_step'
  | 'blocked_by_missing_prerequisite';

export async function runDrySimulationCheck(): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];
  const { jira } = loadProjectProvisionConfig();
  const issueTypesCfg = loadIssueTypesProvisionConfig();
  const fieldsCfg = loadFieldsProvisionConfig();
  const filtersCfg = loadFiltersProvisionConfig();
  const boardCfg = loadBoardProvisionConfig();
  const dashboardsCfg = loadDashboardsProvisionConfig();

  // Projeto
  let projectExists = false;
  const project = await findProjectByKey(jira.projectKey);
  if (project) {
    projectExists = true;
    results.push({
      key: 'sim:project',
      title: 'Simulação de projeto',
      status: 'pass',
      severity: 'info',
      message: 'Projeto já existe e seria reutilizado (would_reuse).',
      blocking: false,
      metadata: {
        outcome: 'would_reuse' as SimulationOutcome,
        jiraId: project.id,
        jiraKey: project.key,
      },
    });
  } else {
    results.push({
      key: 'sim:project',
      title: 'Simulação de projeto',
      status: 'warn',
      severity: 'medium',
      message:
        'Projeto não existe. Em modo apply, o script tentaria criá-lo (would_create) se permissões permitirem.',
      blocking: false,
      metadata: {
        outcome: 'would_create' as SimulationOutcome,
      },
    });
  }

  // Issue types
  try {
    const resp = await jiraClient.request<{ id: string; name: string }[]>({
      url: '/issuetype',
      method: 'GET',
    });
    const existing = resp.data;
    for (const cfg of issueTypesCfg.issueTypes) {
      const has = existing.some((t) => t.name === cfg.name);
      const outcome: SimulationOutcome = has ? 'would_reuse' : 'would_create';
      results.push({
        key: `sim:issuetype:${cfg.key}`,
        title: `Simulação de issue type "${cfg.name}"`,
        status: 'pass',
        severity: 'info',
        message: has
          ? 'Issue type já existe e seria reutilizado (would_reuse).'
          : 'Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config.',
        blocking: false,
        metadata: { outcome },
      });
    }
  } catch (err: any) {
    results.push({
      key: 'sim:issuetype',
      title: 'Simulação de issue types',
      status: 'warn',
      severity: 'medium',
      message:
        'Não foi possível simular issue types (falha ao listar). A simulação completa fica parcialmente comprometida.',
      details: [String(err?.message ?? err)],
      blocking: false,
      metadata: { outcome: 'blocked_by_missing_prerequisite' as SimulationOutcome },
    });
  }

  // Fields (simples: existência por nome)
  try {
    const resp = await jiraClient.request<{ id: string; name: string }[]>({
      url: '/field',
      method: 'GET',
    });
    const existing = resp.data;

    for (const f of fieldsCfg.fields) {
      const has = existing.some((fld) => fld.name === f.name);
      const outcome: SimulationOutcome = has ? 'would_reuse' : projectExists ? 'would_create' : 'blocked_by_missing_prerequisite';
      let message: string;

      if (has) {
        message = 'Campo já existe e seria reutilizado (would_reuse).';
      } else if (projectExists) {
        message =
          'Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário.';
      } else {
        message =
          'Campo não existe e não pode ser criado enquanto o projeto não existir (blocked_by_missing_prerequisite).';
      }

      results.push({
        key: `sim:field:${f.key}`,
        title: `Simulação de campo "${f.name}"`,
        status: has || projectExists ? 'pass' : 'warn',
        severity: has ? 'info' : 'medium',
        message,
        blocking: false,
        metadata: { outcome },
      });
    }
  } catch (err: any) {
    results.push({
      key: 'sim:fields',
      title: 'Simulação de campos',
      status: 'warn',
      severity: 'medium',
      message:
        'Não foi possível simular campos (falha ao listar). A simulação de fields/contextos/opções fica parcialmente comprometida.',
      details: [String(err?.message ?? err)],
      blocking: false,
      metadata: { outcome: 'blocked_by_missing_prerequisite' as SimulationOutcome },
    });
  }

  // Filters
  try {
    for (const cfg of filtersCfg.filters) {
      const resp = await jiraClient.request<{ values: { id: string; name: string }[] }>({
        url: `/filter/search?filterName=${encodeURIComponent(cfg.name)}`,
        method: 'GET',
      });
      const found = resp.data.values?.find((f) => f.name === cfg.name);
      const outcome: SimulationOutcome = found ? 'would_reuse' : 'would_create';
      results.push({
        key: `sim:filter:${cfg.key}`,
        title: `Simulação de filtro "${cfg.name}"`,
        status: 'pass',
        severity: 'info',
        message: found
          ? 'Filtro já existe e seria reutilizado (would_reuse).'
          : 'Filtro não existe e seria criado (would_create).',
        blocking: false,
        metadata: { outcome, filterId: found?.id },
      });
    }
  } catch (err: any) {
    results.push({
      key: 'sim:filters',
      title: 'Simulação de filtros',
      status: 'warn',
      severity: 'medium',
      message:
        'Não foi possível simular filtros (falha ao pesquisar). A simulação de filtros/board fica parcialmente comprometida.',
      details: [String(err?.message ?? err)],
      blocking: false,
      metadata: { outcome: 'blocked_by_missing_prerequisite' as SimulationOutcome },
    });
  }

  // Board
  try {
    const resp = await agileClient.request<{ values: { id: number; name: string; type: string }[] }>({
      url: `/board?projectKeyOrId=${encodeURIComponent(jira.projectKey)}`,
      method: 'GET',
    });
    const existing = resp.data.values?.find(
      (b) => b.name === boardCfg.name && b.type === 'kanban'
    );
    const outcome: SimulationOutcome = existing
      ? 'would_reuse'
      : projectExists
      ? 'would_create'
      : 'blocked_by_missing_prerequisite';

    results.push({
      key: 'sim:board',
      title: 'Simulação de board Kanban',
      status: existing || projectExists ? 'pass' : 'warn',
      severity: existing ? 'info' : 'medium',
      message: existing
        ? 'Board já existe e seria reutilizado (would_reuse).'
        : projectExists
        ? 'Board não existe e seria criado (would_create), usando filtro base configurado.'
        : 'Board não pode ser criado enquanto o projeto não existir (blocked_by_missing_prerequisite).',
      blocking: false,
      metadata: {
        outcome,
        boardId: existing?.id,
      },
    });
  } catch (err: any) {
    results.push({
      key: 'sim:board',
      title: 'Simulação de board Kanban',
      status: 'warn',
      severity: 'medium',
      message:
        'Não foi possível simular o board Kanban (falha ao listar boards). Verifique permissões de Jira Software.',
      details: [String(err?.message ?? err)],
      blocking: false,
      metadata: { outcome: 'blocked_by_missing_prerequisite' as SimulationOutcome },
    });
  }

  // Dashboards
  try {
    const resp = await jiraClient.request<{ dashboards: { id: string; name: string }[] }>({
      url: '/dashboard',
      method: 'GET',
    });
    const existing = resp.data.dashboards || [];

    for (const d of dashboardsCfg.dashboards) {
      const match = existing.find((db) => db.name === d.name);
      const outcome: SimulationOutcome = match ? 'would_reuse' : 'would_create';
      results.push({
        key: `sim:dashboard:${d.key}`,
        title: `Simulação de dashboard "${d.name}"`,
        status: 'pass',
        severity: 'info',
        message: match
          ? 'Dashboard já existe e seria reutilizado (would_reuse).'
          : 'Dashboard não existe e seria criado (would_create).',
        blocking: false,
        metadata: {
          outcome,
          dashboardId: match?.id,
        },
      });
    }
  } catch (err: any) {
    results.push({
      key: 'sim:dashboards',
      title: 'Simulação de dashboards',
      status: 'warn',
      severity: 'medium',
      message:
        'Não foi possível simular dashboards (falha ao listar). Verifique permissões para dashboards.',
      details: [String(err?.message ?? err)],
      blocking: false,
      metadata: { outcome: 'blocked_by_missing_prerequisite' as SimulationOutcome },
    });
  }

  return results;
}

