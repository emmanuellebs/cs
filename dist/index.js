"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
const runtimeConfig_1 = require("./config/runtimeConfig");
const authService_1 = require("./services/authService");
const projectService_1 = require("./services/projectService");
const issueTypeService_1 = require("./services/issueTypeService");
const fieldService_1 = require("./services/fieldService");
const filterService_1 = require("./services/filterService");
const boardService_1 = require("./services/boardService");
const dashboardService_1 = require("./services/dashboardService");
const types_1 = require("./utils/types");
const fileWriter_1 = require("./utils/fileWriter");
const documentationService_1 = require("./services/documentationService");
const preflightRunner_1 = require("./validation/preflightRunner");
const readinessGate_1 = require("./validation/readinessGate");
async function run() {
    const runtime = (0, runtimeConfig_1.loadRuntimeConfig)();
    logger_1.rootLogger.info(`Iniciando provisionamento Jira CS | modo=${runtime.mode} | dryRun=${runtime.dryRun}`);
    const report = (0, types_1.createEmptyReport)();
    // 1) Sempre rodar preflight primeiro
    const preflight = await (0, preflightRunner_1.runPreflight)(runtime.mode);
    if (runtime.mode === 'preflight') {
        // Apenas validações, sem provisionamento
        return;
    }
    // 2) Se modo apply, aplicar readiness gate
    if (runtime.mode === 'apply') {
        const readiness = (0, readinessGate_1.evaluateReadiness)(preflight);
        if (!readiness.canProceed) {
            logger_1.rootLogger.error('Preflight reprovado. Execução em modo apply bloqueada. Veja outputs/preflight-report.* para detalhes.');
            logger_1.rootLogger.error(`Checks bloqueantes: ${readiness.blockingChecks.join(', ')}`);
            process.exitCode = 1;
            return;
        }
    }
    // 3) Validação de autenticação extra (mantida por robustez)
    try {
        await (0, authService_1.validateAuthentication)();
    }
    catch (err) {
        logger_1.rootLogger.error('Falha na autenticação com o Jira. Verifique JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN.', err);
        process.exitCode = 1;
        return;
    }
    // Projeto
    try {
        const projectResult = await (0, projectService_1.ensureProject)();
        report.project = projectResult;
    }
    catch (err) {
        logger_1.rootLogger.error('Erro inesperado ao garantir projeto.', err);
        report.project = {
            key: 'project',
            status: 'failed',
            details: 'Erro inesperado ao garantir projeto.',
            error: err.message,
        };
    }
    const projectId = report.project?.jiraId ?? null;
    // Issue Types
    try {
        const issueTypesResult = await (0, issueTypeService_1.ensureIssueTypes)();
        report.issueTypes.push(...issueTypesResult.results);
    }
    catch (err) {
        logger_1.rootLogger.error('Erro inesperado ao garantir issue types.', err);
        report.issueTypes.push({
            key: 'issuetypes:all',
            status: 'failed',
            details: 'Erro inesperado ao garantir issue types.',
            error: err.message,
        });
    }
    // Fields, contexts e options (somente se tivermos projectId válido)
    if (projectId) {
        try {
            const fieldsResult = await (0, fieldService_1.ensureFieldsForProject)(projectId);
            report.fields.push(...fieldsResult.fieldResults);
            report.fieldContexts.push(...fieldsResult.contextResults);
            report.fieldOptions.push(...fieldsResult.optionResults);
        }
        catch (err) {
            logger_1.rootLogger.error('Erro inesperado ao garantir campos/custom fields.', err);
            report.fields.push({
                key: 'fields:all',
                status: 'failed',
                details: 'Erro inesperado ao garantir campos customizados.',
                error: err.message,
            });
        }
    }
    else {
        report.manualSteps.push({
            key: 'fields:project-missing',
            status: 'manual',
            details: 'ProjectId não está disponível (projeto não criado/reutilizado). Campos, contextos e opções precisam ser configurados após criação manual do projeto.',
        });
    }
    // Filters
    let boardBaseFilterId = null;
    try {
        const filtersResult = await (0, filterService_1.ensureFilters)();
        report.filters.push(...filtersResult.filterResults);
        boardBaseFilterId = filtersResult.boardBaseFilterId;
    }
    catch (err) {
        logger_1.rootLogger.error('Erro inesperado ao garantir filtros JQL.', err);
        report.filters.push({
            key: 'filters:all',
            status: 'failed',
            details: 'Erro inesperado ao garantir filtros JQL.',
            error: err.message,
        });
    }
    // Board Kanban (não pode bloquear o restante)
    try {
        const boardResult = await (0, boardService_1.ensureKanbanBoard)(boardBaseFilterId);
        if (boardResult.boardResult) {
            report.boards.push(boardResult.boardResult);
        }
    }
    catch (err) {
        logger_1.rootLogger.error('Erro inesperado ao garantir board Kanban.', err);
        report.boards.push({
            key: 'board:kanban',
            status: 'failed',
            details: 'Erro inesperado ao garantir board Kanban.',
            error: err.message,
        });
    }
    // Dashboards (não podem bloquear o restante)
    try {
        const dashboardsResult = await (0, dashboardService_1.ensureDashboards)();
        report.dashboards.push(...dashboardsResult.dashboardResults);
    }
    catch (err) {
        logger_1.rootLogger.error('Erro inesperado ao garantir dashboards.', err);
        report.dashboards.push({
            key: 'dashboards:all',
            status: 'failed',
            details: 'Erro inesperado ao garantir dashboards.',
            error: err.message,
        });
    }
    // Documentação complementar
    try {
        (0, documentationService_1.generateAllDocumentation)(report);
    }
    catch (err) {
        logger_1.rootLogger.error('Erro ao gerar documentação complementar em docs/*.md.', err);
        report.manualSteps.push({
            key: 'docs:generation',
            status: 'failed',
            details: 'Falha ao gerar documentação em docs/*.md. Pode ser necessário criá-la manualmente a partir do relatório JSON.',
            error: err.message,
        });
    }
    // Gravar relatório final
    (0, fileWriter_1.writeJsonFile)('outputs/provisioning-summary.json', report);
    let md = `# Resumo do provisionamento Jira CS\n\n`;
    md += `Modo: ${runtime.mode} (dryRun=${runtime.dryRun})\n\n`;
    const section = (title, items) => {
        if (!items || (Array.isArray(items) && items.length === 0)) {
            md += `## ${title}\n\nNenhum item processado.\n\n`;
            return;
        }
        const arr = Array.isArray(items) ? items : [items];
        const counts = arr.reduce((acc, i) => {
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
    (0, fileWriter_1.writeTextFile)('outputs/provisioning-summary.md', md);
    logger_1.rootLogger.info('Provisionamento concluído. Veja outputs/provisioning-summary.* para detalhes.');
}
run().catch((err) => {
    logger_1.rootLogger.error('Falha crítica na execução do script.', err);
    process.exitCode = 1;
});
