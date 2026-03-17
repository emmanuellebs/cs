import { rootLogger } from './utils/logger';
import { loadRuntimeConfig } from './config/runtimeConfig';
import { validateAuthentication } from './services/authService';
import { ensureProject } from './services/projectService';
import { ensureIssueTypes } from './services/issueTypeService';
import { ensureFieldsForProject } from './services/fieldService';
import { ensureFilters } from './services/filterService';
import { ensureKanbanBoard } from './services/boardService';
import { ensureDashboards } from './services/dashboardService';
import { ensureSampleData } from './services/sampleDataService';
import { ensureFieldIssueTypeAssociations } from './services/fieldIssueTypeAssocService';
import { createEmptyReport, ProvisioningReport, ProvisioningItemResult } from './utils/types';
import { writeJsonFile, writeTextFile } from './utils/fileWriter';
import { generateAllDocumentation } from './services/documentationService';
import { runPreflight } from './validation/preflightRunner';
import { evaluateReadiness } from './validation/readinessGate';
import { loadProjectProvisionConfig } from './config/projectConfig';
import { loadIssueTypesProvisionConfig } from './config/issueTypesConfig';
import { loadFieldsProvisionConfig } from './config/fieldsConfig';
import { generateValidationMatrix } from './validation/validationMatrix';

async function run(): Promise<void> {
  const runtime = loadRuntimeConfig();
  rootLogger.info(
    `Iniciando provisionamento Jira CS | modo=${runtime.mode} | dryRun=${runtime.dryRun} | createSampleData=${runtime.createSampleData}`
  );

  const report: ProvisioningReport = createEmptyReport();
  const issueTypesCfg = loadIssueTypesProvisionConfig();
  const fieldsCfg = loadFieldsProvisionConfig();
  let issueTypeMap: Record<string, string | null> = {};
  let fieldMap: Record<string, string> = {};
  let sampleIssueKey: string | null = null;

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

    issueTypeMap = issueTypesCfg.issueTypes.reduce<Record<string, string | null>>((acc, cfg) => {
      const result = issueTypesResult.results.find((it) => it.key === `issuetype:${cfg.key}`);
      acc[cfg.key] = result?.jiraId ?? null;
      return acc;
    }, {});
  } catch (err) {
    rootLogger.error('Erro inesperado ao garantir issue types.', err);
    report.issueTypes.push({
      key: 'issuetypes:all',
      status: 'failed',
      details: 'Erro inesperado ao garantir issue types.',
      error: (err as Error).message,
    });
    issueTypeMap = {};
  }

  // Fields, contexts e options (somente se tivermos projectId válido)
  if (projectId) {
    try {
      const fieldsResult = await ensureFieldsForProject(projectId, issueTypeMap);
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

  // Construir mapa de fields (lógico -> Jira ID) para uso posterior (sample data e validação)
  fieldMap = fieldsCfg.fields.reduce<Record<string, string>>((acc, cfg) => {
    const result = report.fields.find((f) => f.key === `field:${cfg.key}`);
    if (result?.jiraId) {
      acc[cfg.key] = result.jiraId;
    }
    return acc;
  }, {});

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

  // Garantir associação campo -> issue type (sempre que tivermos projeto/issue types mapeados)
  if (projectId) {
    try {
      rootLogger.info('[INDEX] Starting field-to-issue-type-screen associations...');
      const fieldAssocResult = await ensureFieldIssueTypeAssociations(projectId, issueTypeMap, fieldMap);
      report.fieldScreenAssociations = fieldAssocResult.results;
      rootLogger.info(
        `[INDEX] Field associations completed. ${fieldAssocResult.results.length} issue types processed.`
      );
    } catch (err) {
      rootLogger.error('Erro ao associar fields aos screens dos issue types.', err);
      report.fieldScreenAssociations = [
        {
          key: 'field-assoc:all',
          status: 'failed',
          details: 'Erro ao associar campos aos screens dos issue types.',
          error: (err as Error).message,
        },
      ];
    }
  }

  // Sample Data (dados demonstrativos - opcional)
  if (runtime.mode === 'apply' && runtime.createSampleData && projectId) {
    try {
      const { jira } = loadProjectProvisionConfig();
      const sampleDataResult = await ensureSampleData(jira.projectKey, projectId, issueTypeMap, fieldMap);
      report.sampleIssues.push(...sampleDataResult.sampleResults);
      sampleIssueKey = sampleDataResult.sampleResults.find((s) => s.jiraKey)?.jiraKey ?? null;
    } catch (err) {
      rootLogger.error('Erro inesperado ao garantir sample data.', err);
      report.sampleIssues.push({
        key: 'sample:all',
        status: 'failed',
        details: 'Erro inesperado ao criar dados demonstrativos.',
        error: (err as Error).message,
      });
    }
  } else if (runtime.createSampleData && runtime.mode !== 'apply') {
    rootLogger.info('Sample data desabilitado: só disponível em modo apply.');
  }

  // Validação final obrigatória
  if (projectId) {
    try {
      const { jira } = loadProjectProvisionConfig();
      await generateValidationMatrix({
        projectId,
        projectKey: jira.projectKey,
        issueTypeId: issueTypeMap['account'] ?? null,
        fieldMap,
        report,
        sampleIssueKey,
      });
    } catch (err) {
      rootLogger.error('Erro ao gerar matriz de validação.', err);
      report.manualSteps.push({
        key: 'validation:matrix',
        status: 'manual',
        details: 'Falha ao gerar outputs/validation-matrix.md; validar manualmente.',
        error: (err as Error).message,
      });
    }
  } else {
    report.manualSteps.push({
      key: 'validation:project-missing',
      status: 'manual',
      details: 'Sem projectId; não foi possível gerar matriz de validação.',
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
  section('Sample Data (Dados Demonstrativos)', report.sampleIssues);
  section('Pendências Manuais', report.manualSteps);

  writeTextFile('outputs/provisioning-summary.md', md);

  rootLogger.info('Provisionamento concluído. Veja outputs/provisioning-summary.* para detalhes.');
}

run().catch((err) => {
  rootLogger.error('Falha crítica na execução do script.', err);
  process.exitCode = 1;
});

