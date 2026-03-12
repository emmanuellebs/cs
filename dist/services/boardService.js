"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureKanbanBoard = ensureKanbanBoard;
const agileClient_1 = require("../clients/agileClient");
const logger_1 = require("../utils/logger");
const boardConfig_1 = require("../config/boardConfig");
const envConfig_1 = require("../config/envConfig");
const logger = new logger_1.Logger({ module: 'boardService' });
function buildBoardResult(status, extra = {}) {
    return {
        key: 'board:kanban',
        status,
        ...extra,
    };
}
async function listBoardsForProject(projectKey) {
    const resp = await agileClient_1.agileClient.request({
        url: `/board?projectKeyOrId=${encodeURIComponent(projectKey)}`,
        method: 'GET',
    });
    return resp.data.values || [];
}
async function createKanbanBoard(projectKey, filterId, name) {
    const resp = await agileClient_1.agileClient.request({
        url: '/board',
        method: 'POST',
        data: {
            name,
            type: 'kanban',
            filterId: Number(filterId),
            location: {
                type: 'project',
                projectKeyOrId: projectKey,
            },
        },
    });
    return resp.data;
}
async function ensureKanbanBoard(boardBaseFilterId) {
    const env = (0, envConfig_1.loadJiraEnvConfig)();
    const cfg = (0, boardConfig_1.loadBoardProvisionConfig)();
    const mode = agileClient_1.agileClient.getMode();
    try {
        const boards = await listBoardsForProject(env.projectKey);
        const existing = boards.find((b) => b.name === cfg.name && b.type === 'kanban') || null;
        if (existing) {
            logger.info(`Board Kanban reutilizado: ${cfg.name} (${existing.id})`);
            return {
                boardResult: buildBoardResult('reused', {
                    name: cfg.name,
                    jiraId: String(existing.id),
                    details: 'Board Kanban já existente foi reutilizado.',
                }),
            };
        }
        if (!boardBaseFilterId) {
            logger.warn('Nenhum filtro base para o board foi identificado. O board não será criado automaticamente.');
            return {
                boardResult: buildBoardResult('manual', {
                    name: cfg.name,
                    details: 'Sem filtro base disponível. Crie manualmente um board Kanban com filtro "project = {projectKey}".',
                    metadata: {
                        suggestedJql: `project = ${env.projectKey} ORDER BY updated DESC`,
                    },
                }),
            };
        }
        if (mode.mode === 'audit' || mode.dryRun) {
            logger.info(`Board Kanban ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`);
            return {
                boardResult: buildBoardResult('skipped', {
                    name: cfg.name,
                    details: 'Board não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado usando o filtro base.',
                    metadata: {
                        boardBaseFilterId,
                    },
                }),
            };
        }
        try {
            const created = await createKanbanBoard(env.projectKey, boardBaseFilterId, cfg.name);
            logger.info(`Board Kanban criado: ${cfg.name} (${created.id})`);
            return {
                boardResult: buildBoardResult('created', {
                    name: cfg.name,
                    jiraId: String(created.id),
                    details: 'Board Kanban criado via API usando filtro base do projeto.',
                    metadata: {
                        boardBaseFilterId,
                        type: created.type,
                    },
                }),
            };
        }
        catch (err) {
            logger.error(`Falha ao criar board Kanban ${cfg.name}.`, err);
            return {
                boardResult: buildBoardResult('failed', {
                    name: cfg.name,
                    details: 'Falha ao criar board Kanban via API. Será necessário criar manualmente com o filtro base do projeto.',
                    error: err?.message,
                    metadata: {
                        boardBaseFilterId,
                        suggestedJql: `project = ${env.projectKey} ORDER BY updated DESC`,
                    },
                }),
            };
        }
    }
    catch (err) {
        logger.error('Erro inesperado ao garantir board Kanban.', err);
        return {
            boardResult: buildBoardResult('failed', {
                name: cfg.name,
                details: 'Erro inesperado ao garantir board Kanban.',
                error: err?.message,
            }),
        };
    }
}
