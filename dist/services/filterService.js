"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureFilters = ensureFilters;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const filtersConfig_1 = require("../config/filtersConfig");
const envConfig_1 = require("../config/envConfig");
const logger = new logger_1.Logger({ module: 'filterService' });
function buildFilterResult(cfg, status, extra = {}) {
    return {
        key: `filter:${cfg.key}`,
        name: cfg.name,
        status,
        ...extra,
    };
}
async function findFiltersByName(name) {
    const resp = await jiraClient_1.jiraClient.request({
        url: `/filter/search?filterName=${encodeURIComponent(name)}`,
        method: 'GET',
    });
    return resp.data.values || [];
}
async function createFilter(cfg, jql) {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/filter',
        method: 'POST',
        data: {
            name: cfg.name,
            description: cfg.description ?? '',
            jql,
        },
    });
    return resp.data;
}
async function ensureFilters() {
    const config = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const env = (0, envConfig_1.loadJiraEnvConfig)();
    const mode = jiraClient_1.jiraClient.getMode();
    const filterResults = [];
    const logicalToFilterId = {
        clientsAtRisk: null,
        upcomingRenewals: null,
        noRecentInteractions: null,
        openOpportunities: null,
        accountsByLifecycle: null,
        activeAccounts: null,
        churnedAccounts: null,
        interactionsThisMonth: null,
        boardBase: null,
    };
    let boardBaseFilterId = null;
    for (const cfg of config.filters) {
        try {
            const jql = cfg.jqlTemplate.replace(/{projectKey}/g, env.projectKey);
            // 1) Busca por nome
            const existingFilters = await findFiltersByName(cfg.name);
            const existing = existingFilters.find((f) => f.name === cfg.name) || null;
            if (existing) {
                logger.info(`Filtro reutilizado: ${cfg.name} (${existing.id})`);
                logicalToFilterId[cfg.key] = existing.id;
                if (cfg.isBoardBase) {
                    boardBaseFilterId = existing.id;
                }
                filterResults.push(buildFilterResult(cfg, 'reused', {
                    jiraId: existing.id,
                    details: 'Filtro já existente foi reutilizado.',
                    metadata: { jql: existing.jql },
                }));
                continue;
            }
            if (mode.mode === 'audit' || mode.dryRun) {
                logger.info(`Filtro ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`);
                logicalToFilterId[cfg.key] = null;
                filterResults.push(buildFilterResult(cfg, 'skipped', {
                    details: 'Filtro não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
                    metadata: { jql },
                }));
                continue;
            }
            // Criação em modo apply
            try {
                const created = await createFilter(cfg, jql);
                logger.info(`Filtro criado: ${cfg.name} (${created.id})`);
                logicalToFilterId[cfg.key] = created.id;
                if (cfg.isBoardBase) {
                    boardBaseFilterId = created.id;
                }
                filterResults.push(buildFilterResult(cfg, 'created', {
                    jiraId: created.id,
                    details: 'Filtro criado via API.',
                    metadata: { jql: created.jql },
                }));
            }
            catch (err) {
                logger.error(`Falha ao criar filtro ${cfg.name}.`, err);
                logicalToFilterId[cfg.key] = null;
                filterResults.push(buildFilterResult(cfg, 'failed', {
                    details: 'Falha ao criar filtro via API.',
                    error: err?.message,
                    metadata: { jql },
                }));
            }
        }
        catch (err) {
            logger.error(`Erro inesperado ao garantir filtro ${cfg.name}.`, err);
            logicalToFilterId[cfg.key] = null;
            filterResults.push(buildFilterResult(cfg, 'failed', {
                details: 'Erro inesperado ao garantir filtro.',
                error: err?.message,
            }));
        }
    }
    return {
        filterResults,
        logicalToFilterId,
        boardBaseFilterId,
    };
}
