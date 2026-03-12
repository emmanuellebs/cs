"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDrySimulationCheck = runDrySimulationCheck;
const projectService_1 = require("../../services/projectService");
const issueTypesConfig_1 = require("../../config/issueTypesConfig");
const fieldsConfig_1 = require("../../config/fieldsConfig");
const filtersConfig_1 = require("../../config/filtersConfig");
const boardConfig_1 = require("../../config/boardConfig");
const dashboardsConfig_1 = require("../../config/dashboardsConfig");
const projectConfig_1 = require("../../config/projectConfig");
const jiraClient_1 = require("../../clients/jiraClient");
const agileClient_1 = require("../../clients/agileClient");
async function runDrySimulationCheck() {
    const results = [];
    const { jira } = (0, projectConfig_1.loadProjectProvisionConfig)();
    const issueTypesCfg = (0, issueTypesConfig_1.loadIssueTypesProvisionConfig)();
    const fieldsCfg = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    const filtersCfg = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const boardCfg = (0, boardConfig_1.loadBoardProvisionConfig)();
    const dashboardsCfg = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    // Projeto
    let projectExists = false;
    const project = await (0, projectService_1.findProjectByKey)(jira.projectKey);
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
                outcome: 'would_reuse',
                jiraId: project.id,
                jiraKey: project.key,
            },
        });
    }
    else {
        results.push({
            key: 'sim:project',
            title: 'Simulação de projeto',
            status: 'warn',
            severity: 'medium',
            message: 'Projeto não existe. Em modo apply, o script tentaria criá-lo (would_create) se permissões permitirem.',
            blocking: false,
            metadata: {
                outcome: 'would_create',
            },
        });
    }
    // Issue types
    try {
        const resp = await jiraClient_1.jiraClient.request({
            url: '/issuetype',
            method: 'GET',
        });
        const existing = resp.data;
        for (const cfg of issueTypesCfg.issueTypes) {
            const has = existing.some((t) => t.name === cfg.name);
            const outcome = has ? 'would_reuse' : 'would_create';
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
    }
    catch (err) {
        results.push({
            key: 'sim:issuetype',
            title: 'Simulação de issue types',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível simular issue types (falha ao listar). A simulação completa fica parcialmente comprometida.',
            details: [String(err?.message ?? err)],
            blocking: false,
            metadata: { outcome: 'blocked_by_missing_prerequisite' },
        });
    }
    // Fields (simples: existência por nome)
    try {
        const resp = await jiraClient_1.jiraClient.request({
            url: '/field',
            method: 'GET',
        });
        const existing = resp.data;
        for (const f of fieldsCfg.fields) {
            const has = existing.some((fld) => fld.name === f.name);
            const outcome = has ? 'would_reuse' : projectExists ? 'would_create' : 'blocked_by_missing_prerequisite';
            let message;
            if (has) {
                message = 'Campo já existe e seria reutilizado (would_reuse).';
            }
            else if (projectExists) {
                message =
                    'Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário.';
            }
            else {
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
    }
    catch (err) {
        results.push({
            key: 'sim:fields',
            title: 'Simulação de campos',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível simular campos (falha ao listar). A simulação de fields/contextos/opções fica parcialmente comprometida.',
            details: [String(err?.message ?? err)],
            blocking: false,
            metadata: { outcome: 'blocked_by_missing_prerequisite' },
        });
    }
    // Filters
    try {
        for (const cfg of filtersCfg.filters) {
            const resp = await jiraClient_1.jiraClient.request({
                url: `/filter/search?filterName=${encodeURIComponent(cfg.name)}`,
                method: 'GET',
            });
            const found = resp.data.values?.find((f) => f.name === cfg.name);
            const outcome = found ? 'would_reuse' : 'would_create';
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
    }
    catch (err) {
        results.push({
            key: 'sim:filters',
            title: 'Simulação de filtros',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível simular filtros (falha ao pesquisar). A simulação de filtros/board fica parcialmente comprometida.',
            details: [String(err?.message ?? err)],
            blocking: false,
            metadata: { outcome: 'blocked_by_missing_prerequisite' },
        });
    }
    // Board
    try {
        const resp = await agileClient_1.agileClient.request({
            url: `/board?projectKeyOrId=${encodeURIComponent(jira.projectKey)}`,
            method: 'GET',
        });
        const existing = resp.data.values?.find((b) => b.name === boardCfg.name && b.type === 'kanban');
        const outcome = existing
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
    }
    catch (err) {
        results.push({
            key: 'sim:board',
            title: 'Simulação de board Kanban',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível simular o board Kanban (falha ao listar boards). Verifique permissões de Jira Software.',
            details: [String(err?.message ?? err)],
            blocking: false,
            metadata: { outcome: 'blocked_by_missing_prerequisite' },
        });
    }
    // Dashboards
    try {
        const resp = await jiraClient_1.jiraClient.request({
            url: '/dashboard',
            method: 'GET',
        });
        const existing = resp.data.dashboards || [];
        for (const d of dashboardsCfg.dashboards) {
            const match = existing.find((db) => db.name === d.name);
            const outcome = match ? 'would_reuse' : 'would_create';
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
    }
    catch (err) {
        results.push({
            key: 'sim:dashboards',
            title: 'Simulação de dashboards',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível simular dashboards (falha ao listar). Verifique permissões para dashboards.',
            details: [String(err?.message ?? err)],
            blocking: false,
            metadata: { outcome: 'blocked_by_missing_prerequisite' },
        });
    }
    return results;
}
