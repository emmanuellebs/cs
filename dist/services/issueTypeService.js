"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureIssueTypes = ensureIssueTypes;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const issueTypesConfig_1 = require("../config/issueTypesConfig");
const logger = new logger_1.Logger({ module: 'issueTypeService' });
async function listAllIssueTypes() {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/issuetype',
        method: 'GET',
    });
    return resp.data;
}
async function createIssueType(cfg) {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/issuetype',
        method: 'POST',
        data: {
            name: cfg.name,
            description: cfg.description ?? '',
            type: 'standard',
        },
    });
    return resp.data;
}
function buildResult(cfg, status, extra = {}) {
    return {
        key: `issuetype:${cfg.key}`,
        name: cfg.name,
        status,
        ...extra,
    };
}
async function ensureIssueTypes() {
    const config = (0, issueTypesConfig_1.loadIssueTypesProvisionConfig)();
    const allTypes = await listAllIssueTypes();
    const results = [];
    const logicalToJiraTypeId = {
        account: null,
        interaction: null,
        successPlan: null,
        risk: null,
        opportunity: null,
        renewal: null,
    };
    for (const cfg of config.issueTypes) {
        try {
            // 1) Tenta encontrar issue type com o nome desejado
            const existing = allTypes.find((t) => t.name === cfg.name);
            if (existing) {
                logger.info(`Issue type reutilizado: ${cfg.name} (${existing.id})`);
                logicalToJiraTypeId[cfg.key] = existing.id;
                results.push(buildResult(cfg, 'reused', {
                    jiraId: existing.id,
                    details: 'Issue type já existente foi reutilizado.',
                }));
                continue;
            }
            // 2) Tenta criar um issue type customizado (apenas em modo apply/dry-run=false)
            const mode = jiraClient_1.jiraClient.getMode();
            if (mode.mode === 'audit' || mode.dryRun) {
                logger.info(`Issue type ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`);
                // Tenta fallback direto para issue type padrão já existente
                const fallback = allTypes.find((t) => t.name === cfg.fallbackStandardTypeName);
                if (fallback) {
                    logicalToJiraTypeId[cfg.key] = fallback.id;
                    results.push(buildResult(cfg, 'reused', {
                        jiraId: fallback.id,
                        details: 'Issue type customizado não criado em modo de auditoria/dry-run. Fallback para tipo padrão existente.',
                        metadata: {
                            fallbackTypeName: fallback.name,
                        },
                    }));
                }
                else {
                    logicalToJiraTypeId[cfg.key] = null;
                    results.push(buildResult(cfg, 'manual', {
                        details: 'Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente.',
                    }));
                }
                continue;
            }
            try {
                const created = await createIssueType(cfg);
                logicalToJiraTypeId[cfg.key] = created.id;
                results.push(buildResult(cfg, 'created', {
                    jiraId: created.id,
                    details: 'Issue type criado via API.',
                }));
                // Atualiza cache local para que próximos tipos possam reutilizar informações se necessário
                allTypes.push(created);
            }
            catch (err) {
                logger.error(`Falha ao criar issue type ${cfg.name}. Tentando fallback para tipo padrão ${cfg.fallbackStandardTypeName}.`, err);
                // 3) Fallback configurável para tipo padrão existente
                const fallback = allTypes.find((t) => t.name === cfg.fallbackStandardTypeName);
                if (fallback) {
                    logicalToJiraTypeId[cfg.key] = fallback.id;
                    results.push(buildResult(cfg, 'reused', {
                        jiraId: fallback.id,
                        details: 'Falha ao criar issue type customizado. Fallback para issue type padrão existente.',
                        warnings: [
                            `Issue type customizado ${cfg.name} não pôde ser criado. Usando ${fallback.name} como fallback.`,
                        ],
                        metadata: {
                            fallbackTypeName: fallback.name,
                        },
                    }));
                }
                else {
                    logicalToJiraTypeId[cfg.key] = null;
                    results.push(buildResult(cfg, 'manual', {
                        details: 'Falha ao criar issue type customizado e nenhum fallback padrão foi encontrado. Necessário criar/ajustar manualmente.',
                        error: err?.message,
                    }));
                }
            }
        }
        catch (err) {
            logger.error(`Erro inesperado ao garantir issue type ${cfg.name}.`, err);
            logicalToJiraTypeId[cfg.key] = null;
            results.push(buildResult(cfg, 'failed', {
                details: 'Erro inesperado ao garantir issue type.',
                error: err?.message,
            }));
        }
    }
    return { results, logicalToJiraTypeId };
}
