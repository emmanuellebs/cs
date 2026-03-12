"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDashboards = ensureDashboards;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const dashboardsConfig_1 = require("../config/dashboardsConfig");
const logger = new logger_1.Logger({ module: 'dashboardService' });
function buildDashboardResult(cfg, status, extra = {}) {
    return {
        key: `dashboard:${cfg.key}`,
        name: cfg.name,
        status,
        ...extra,
    };
}
async function listDashboards() {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/dashboard',
        method: 'GET',
    });
    return resp.data.dashboards || [];
}
async function createDashboard(cfg) {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/dashboard',
        method: 'POST',
        data: {
            name: cfg.name,
            description: cfg.description ?? '',
        },
    });
    return resp.data;
}
async function tryListGadgets(dashboardId) {
    try {
        const resp = await jiraClient_1.jiraClient.request({
            url: `/dashboard/${encodeURIComponent(dashboardId)}/gadget`,
            method: 'GET',
        });
        return resp.data.gadgets || [];
    }
    catch (err) {
        logger.warn(`Não foi possível listar gadgets via API para o dashboard ${dashboardId}. Isso será tratado como limitação e documentado.`);
        return null;
    }
}
async function ensureDashboards() {
    const config = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    const mode = jiraClient_1.jiraClient.getMode();
    const dashboardResults = [];
    const logicalToDashboardId = {
        health: null,
        relationship: null,
        growth: null,
    };
    let existingDashboards = [];
    try {
        existingDashboards = await listDashboards();
    }
    catch (err) {
        logger.error('Falha ao listar dashboards existentes.', err);
        // Ainda assim seguimos, marcando dashboards como manual/failed individualmente
    }
    for (const cfg of config.dashboards) {
        try {
            const existing = existingDashboards.find((d) => d.name === cfg.name) || null;
            if (existing) {
                logger.info(`Dashboard reutilizado: ${cfg.name} (${existing.id})`);
                // Tentativa opcional de descobrir gadgets existentes (para fins de documentação)
                const gadgets = await tryListGadgets(existing.id);
                logicalToDashboardId[cfg.key] = existing.id;
                dashboardResults.push(buildDashboardResult(cfg, 'reused', {
                    jiraId: existing.id,
                    details: 'Dashboard já existente foi reutilizado.',
                    metadata: {
                        gadgetsDiscovered: gadgets
                            ? gadgets.map((g) => ({
                                id: g.id,
                                title: g.title,
                                type: g.type,
                            }))
                            : 'unavailable',
                        gadgetBlueprints: cfg.gadgets,
                    },
                }));
                continue;
            }
            if (mode.mode === 'audit' || mode.dryRun) {
                logger.info(`Dashboard ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`);
                logicalToDashboardId[cfg.key] = null;
                dashboardResults.push(buildDashboardResult(cfg, 'skipped', {
                    details: 'Dashboard não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado vazio e gadgets serão configurados manualmente.',
                    metadata: {
                        gadgetBlueprints: cfg.gadgets,
                    },
                }));
                continue;
            }
            try {
                const created = await createDashboard(cfg);
                logger.info(`Dashboard criado: ${cfg.name} (${created.id})`);
                // Tentativa de ler gadgets (deve ser vazio, mas serve para detectar suporte)
                const gadgets = await tryListGadgets(created.id);
                logicalToDashboardId[cfg.key] = created.id;
                dashboardResults.push(buildDashboardResult(cfg, 'created', {
                    jiraId: created.id,
                    details: 'Dashboard criado via API. Gadgets devem ser configurados manualmente conforme blueprint.',
                    metadata: {
                        gadgetsDiscovered: gadgets
                            ? gadgets.map((g) => ({
                                id: g.id,
                                title: g.title,
                                type: g.type,
                            }))
                            : 'unavailable',
                        gadgetBlueprints: cfg.gadgets,
                    },
                }));
            }
            catch (err) {
                logger.error(`Falha ao criar dashboard ${cfg.name}.`, err);
                logicalToDashboardId[cfg.key] = null;
                dashboardResults.push(buildDashboardResult(cfg, 'manual', {
                    details: 'Falha ao criar dashboard via API. Será necessário criar manualmente e adicionar gadgets conforme blueprint.',
                    error: err?.message,
                    metadata: {
                        gadgetBlueprints: cfg.gadgets,
                    },
                }));
            }
        }
        catch (err) {
            logger.error(`Erro inesperado ao garantir dashboard ${cfg.name}.`, err);
            logicalToDashboardId[cfg.key] = null;
            dashboardResults.push(buildDashboardResult(cfg, 'failed', {
                details: 'Erro inesperado ao garantir dashboard.',
                error: err?.message,
                metadata: {
                    gadgetBlueprints: cfg.gadgets,
                },
            }));
        }
    }
    return {
        dashboardResults,
        logicalToDashboardId,
    };
}
