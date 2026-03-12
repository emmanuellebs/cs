import { rootLogger } from './utils/logger';
import { loadRuntimeConfig } from './config/runtimeConfig';
import { validateAuthentication } from './services/authService';
import { ensureProject } from './services/projectService';
import { ensureIssueTypes } from './services/issueTypeService';
import { ensureFieldsForProject } from './services/fieldService';
import { ensureFilters } from './services/filterService';
import { ensureKanbanBoard } from './services/boardService';
import { ensureDashboards } from './services/dashboardService';
import { createEmptyReport, ProvisioningReport, ProvisioningItemResult } from './utils/types';
import { writeJsonFile, writeTextFile } from './utils/fileWriter';
import { generateAllDocumentation } from './services/documentationService';
import { runPreflight } from './validation/preflightRunner';
import { evaluateReadiness } from './validation/readinessGate';

async function run(): Promise<void> {
  const runtime = loadRuntimeConfig();
  rootLogger.info(
    `Iniciando provisionamento Jira CS | modo=${runtime.mode} | dryRun=${runtime.dryRun}`
  );

  const report: ProvisioningReport = createEmptyReport();

  // 1) Sempre rodar preflight primeiro
  const preflight = await runPreflight(runtime.mode);

  if (runtime.mode === 'preflight') {
    // Apenas validações, sem provisionamento
    return;
  }

  // 2) Se modo apply, aplicar readiness gate
  if (runtime.mode === 'apply') {
    const readiness = evaluateReadiness(preflight);
    if (!readiness.canProceed) {
      rootLogger.error(
        'Preflight reprovado. Execução em modo apply bloqueada. Veja outputs/preflight-report.* para detalhes.'
      );
      rootLogger.error(`Checks bloqueantes: ${readiness.blockingChecks.join(', ')}`);
      process.exitCode = 1;
      return;
    }
  }

  // 3) Validação de autenticação extra (mantida por robustez)
  try {
    await validateAuthentication();
  } catch (err) {
    rootLogger.error(
      'Falha na autenticação com o Jira. Verifique JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN.',
      err
    );
    process.exitCode = 1;
    return;
  }

  // Projeto
  try {
    const projectResult = await ensureProject();
    report.project = projectResult;
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir projeto.', err);
    report.project = {
      key: 'project',
      status: 'failed',
      details: 'Erro inesperado ao garantir projeto.',
      error: (err as Error).message,
    };
  }

  const projectId = report.project?.jiraId ?? null;

  // Issue Types
  try {
    const issueTypesResult = await ensureIssueTypes();
    report.issueTypes.push(...issueTypesResult.results);
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir issue types.', err);
    report.issueTypes.push({
      key: 'issuetypes:all',
      status: 'failed',
      details: 'Erro inesperado ao garantir issue types.',
      error: (err as Error).message,
    });
  }

  // Fields, contexts e options (somente se tivermos projectId válido)
  if (projectId) {
    try {
      const fieldsResult = await ensureFieldsForProject(projectId);
      report.fields.push(...fieldsResult.fieldResults);
      report.fieldContexts.push(...fieldsResult.contextResults);
      report.fieldOptions.push(...fieldsResult.optionResults);
    } catch (err) {
      rootLogger.error('Erro inesperado ao garantir campos/custom fields.', err);
      report.fields.push({
        key: 'fields:all',
        status: 'failed',
        details: 'Erro inesperado ao garantir campos customizados.',
        error: (err as Error).message,
      });
    }
  } else {
    report.manualSteps.push({
      key: 'fields:project-missing',
      status: 'manual',
      details:
        'ProjectId não está disponível (projeto não criado/reutilizado). Campos, contextos e opções precisam ser configurados após criação manual do projeto.',
    });
  }

  // Filters
  let boardBaseFilterId: string | null = null;
  try {
    const filtersResult = await ensureFilters();
    report.filters.push(...filtersResult.filterResults);
    boardBaseFilterId = filtersResult.boardBaseFilterId;
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir filtros JQL.', err);
    report.filters.push({
      key: 'filters:all',
      status: 'failed',
      details: 'Erro inesperado ao garantir filtros JQL.',
      error: (err as Error).message,
    });
  }

  // Board Kanban (não pode bloquear o restante)
  try {
    const boardResult = await ensureKanbanBoard(boardBaseFilterId);
    if (boardResult.boardResult) {
      report.boards.push(boardResult.boardResult);
    }
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir board Kanban.', err);
    report.boards.push({
      key: 'board:kanban',
      status: 'failed',
      details: 'Erro inesperado ao garantir board Kanban.',
      error: (err as Error).message,
    });
  }

  // Dashboards (não podem bloquear o restante)
  try {
    const dashboardsResult = await ensureDashboards();
    report.dashboards.push(...dashboardsResult.dashboardResults);
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir dashboards.', err);
    report.dashboards.push({
      key: 'dashboards:all',
      status: 'failed',
      details: 'Erro inesperado ao garantir dashboards.',
      error: (err as Error).message,
    });
  }

  // Documentação complementar
  try {
    generateAllDocumentation(report);
  } catch (err) {
    rootLogger.error('Erro ao gerar documentação complementar em docs/*.md.', err);
    report.manualSteps.push({
      key: 'docs:generation',
      status: 'failed',
      details:
        'Falha ao gerar documentação em docs/*.md. Pode ser necessário criá-la manualmente a partir do relatório JSON.',
      error: (err as Error).message,
    });
  }

  // Gravar relatório final
  writeJsonFile('outputs/provisioning-summary.json', report);
  let md = `# Resumo do provisionamento Jira CS\n\n`;
  md += `Modo: ${runtime.mode} (dryRun=${runtime.dryRun})\n\n`;

  const section = (title: string, items: ProvisioningItemResult[] | null) => {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      md += `## ${title}\n\nNenhum item processado.\n\n`;
      return;
    }
    const arr = Array.isArray(items) ? items : [items];
    const counts = arr.reduce<Record<string, number>>((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});
    md += `## ${title}\n\n`;
    md += `Status por categoria: ${Object.entries(counts)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ')}\n\n`;
  };

  section('Projeto', report.project ? [report.project] : []);
  section('Issue Types', report.issueTypes);
  section('Campos', report.fields);
  section('Contextos de Campos', report.fieldContexts);
  section('Opções de Campos', report.fieldOptions);
  section('Filtros JQL', report.filters);
  section('Boards', report.boards);
  section('Dashboards', report.dashboards);
  section('Pendências Manuais', report.manualSteps);

  writeTextFile('outputs/provisioning-summary.md', md);

  rootLogger.info('Provisionamento concluído. Veja outputs/provisioning-summary.* para detalhes.');
}

run().catch((err) => {
  rootLogger.error('Falha crítica na execução do script.', err);
  process.exitCode = 1;
});

