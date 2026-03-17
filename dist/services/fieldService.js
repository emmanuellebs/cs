"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureFieldsForProject = ensureFieldsForProject;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const fieldsConfig_1 = require("../config/fieldsConfig");
const logger = new logger_1.Logger({ module: 'fieldService' });
function mapKindToTypeAndSearcher(kind) {
    switch (kind) {
        case 'number':
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:exactnumber',
            };
        case 'date':
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:daterange',
            };
        case 'paragraph':
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
            };
        case 'select':
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:multiselectsearcher',
            };
        case 'userPicker':
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:userpickergroupsearcher',
            };
        case 'text':
        default:
            return {
                type: 'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
                searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
            };
    }
}
function getIssueTypeIdsForField(field, issueTypeMap) {
    if (!issueTypeMap)
        return [];
    const ids = [];
    const pushIf = (key) => {
        const value = issueTypeMap[key];
        if (value) {
            ids.push(value);
        }
    };
    switch (field.group) {
        case 'account':
        case 'primaryContact':
        case 'csOperation':
            pushIf('account');
            break;
        case 'interaction':
            pushIf('interaction');
            break;
        case 'successPlan':
            pushIf('successPlan');
            break;
        case 'riskOpportunity':
            pushIf('risk');
            pushIf('opportunity');
            break;
        default:
            break;
    }
    return Array.from(new Set(ids));
}
async function listAllFields() {
    const resp = await jiraClient_1.jiraClient.request({
        url: '/field',
        method: 'GET',
    });
    return resp.data;
}
async function createField(cfg) {
    const mapped = mapKindToTypeAndSearcher(cfg.kind);
    const resp = await jiraClient_1.jiraClient.request({
        url: '/field',
        method: 'POST',
        data: {
            name: cfg.name,
            description: cfg.description ?? '',
            type: mapped.type,
            searcherKey: mapped.searcherKey,
        },
    });
    return resp.data;
}
function buildFieldResult(cfg, status, extra = {}) {
    return {
        key: `field:${cfg.key}`,
        name: cfg.name,
        status,
        ...extra,
    };
}
function buildContextResult(fieldId, fieldName, ctxName, status, extra = {}) {
    return {
        key: `fieldContext:${fieldId}:${ctxName}`,
        name: `${fieldName} / ${ctxName}`,
        status,
        ...extra,
    };
}
function buildOptionResult(fieldId, fieldName, ctxId, optionValue, status, extra = {}) {
    return {
        key: `fieldOption:${fieldId}:${ctxId}:${optionValue}`,
        name: `${fieldName} / ${optionValue}`,
        status,
        ...extra,
    };
}
async function listFieldContexts(fieldId) {
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(fieldId)}/context`,
        method: 'GET',
    });
    return resp.data.values || [];
}
async function createFieldContext(field, projectId, issueTypeIds) {
    const name = `Contexto CS - ${field.name}`;
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(field.id)}/context`,
        method: 'POST',
        data: {
            name,
            projectIds: [projectId],
            issueTypeIds: issueTypeIds.length ? issueTypeIds : undefined,
        },
    });
    return resp.data;
}
async function updateFieldContext(fieldId, contextId, projectId, issueTypeIds) {
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(contextId)}`,
        method: 'PUT',
        data: {
            projectIds: [projectId],
            issueTypeIds: issueTypeIds.length ? issueTypeIds : undefined,
        },
    });
    return resp.data;
}
async function listFieldOptions(fieldId, contextId) {
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(contextId)}/option`,
        method: 'GET',
    });
    return resp.data.values || [];
}
async function createFieldOptions(fieldId, contextId, values) {
    if (!values.length) {
        return [];
    }
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(contextId)}/option`,
        method: 'POST',
        data: {
            options: values.map((v) => ({ value: v })),
        },
    });
    return resp.data.options || [];
}
/**
 * Garante campo, contexto por projeto e opções (para campos select).
 * Não lança exceção em caso de falha isolada; registra status no resultado.
 */
async function ensureFieldsForProject(projectId, issueTypeMap) {
    const config = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    const mode = jiraClient_1.jiraClient.getMode();
    logger.info(`[LOAD] fieldsConfig.ts loaded (${config.fields.length} campos)`);
    const allFields = await listAllFields();
    const fieldResults = [];
    const contextResults = [];
    const optionResults = [];
    for (const cfg of config.fields) {
        try {
            // 1) Campo
            let field = allFields.find((f) => f.name === cfg.name) || null;
            if (field) {
                logger.info(`[RESOLVE] Campo reutilizado: ${cfg.name} (${field.id})`);
                fieldResults.push(buildFieldResult(cfg, 'reused', {
                    jiraId: field.id,
                    details: 'Campo já existente foi reutilizado.',
                }));
            }
            else if (mode.mode === 'audit' || mode.dryRun) {
                logger.info(`Campo ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`);
                fieldResults.push(buildFieldResult(cfg, 'skipped', {
                    details: 'Campo não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
                }));
            }
            else {
                try {
                    field = await createField(cfg);
                    allFields.push(field);
                    logger.info(`[CREATE] Field created: ${cfg.name} (${field.id})`);
                    fieldResults.push(buildFieldResult(cfg, 'created', {
                        jiraId: field.id,
                        details: 'Campo criado via API.',
                    }));
                }
                catch (err) {
                    logger.error(`Falha ao criar campo ${cfg.name}.`, err);
                    fieldResults.push(buildFieldResult(cfg, 'failed', {
                        details: 'Falha ao criar campo via API.',
                        error: err?.message,
                    }));
                }
            }
            // Se não existe fieldId conhecido, não conseguimos criar contexto/opções
            if (!field || !field.id) {
                if (cfg.kind === 'select') {
                    contextResults.push(buildContextResult('unknown', cfg.name, 'Contexto CS', 'manual', {
                        details: 'Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente.',
                    }));
                }
                continue;
            }
            // 2) Contexto específico para o projeto (apenas para selects, mas deixamos pronto para outros se necessário)
            let context = null;
            const issueTypeIds = getIssueTypeIdsForField(cfg, issueTypeMap);
            try {
                const contexts = await listFieldContexts(field.id);
                context =
                    contexts.find((c) => c.projectIds?.includes(projectId) &&
                        (!issueTypeIds.length ||
                            issueTypeIds.every((id) => (c.issueTypeIds || []).includes(id)))) || null;
                const globalContext = contexts.find((c) => (!c.projectIds || c.projectIds.length === 0) &&
                    (!c.issueTypeIds || c.issueTypeIds.length === 0)) || null;
                // Se existe apenas contexto global, tentar restringir ao projeto/issue type
                if (!context && globalContext && !(mode.mode === 'audit' || mode.dryRun)) {
                    try {
                        const updated = await updateFieldContext(field.id, globalContext.id, projectId, issueTypeIds);
                        context = updated;
                        logger.info(`[LINK] Contexto global do campo ${cfg.name} restringido ao projeto ${projectId} (${updated.id})`);
                    }
                    catch (err) {
                        logger.warn(`[WARN] Não foi possível restringir contexto global do campo ${cfg.name}. Pode permanecer visível em outros projetos.`);
                    }
                }
                if (context) {
                    logger.info(`[RESOLVE] Contexto reutilizado para ${cfg.name} no projeto ${projectId}: ${context.id}`);
                    contextResults.push(buildContextResult(field.id, cfg.name, context.name, 'reused', {
                        jiraId: context.id,
                        details: 'Contexto de campo existente foi reutilizado.',
                    }));
                }
                else if (mode.mode === 'audit' || mode.dryRun) {
                    logger.info(`Campo ${cfg.name} não possui contexto específico para o projeto ${projectId}. Modo atual impede criação automática.`);
                    contextResults.push(buildContextResult(field.id, cfg.name, 'Contexto CS', 'skipped', {
                        details: 'Contexto por projeto não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
                    }));
                }
                else {
                    context = await createFieldContext(field, projectId, issueTypeIds);
                    logger.info(`[LINK] Contexto criado para ${cfg.name} no projeto ${projectId}: ${context.id}`);
                    contextResults.push(buildContextResult(field.id, cfg.name, context.name, 'created', {
                        jiraId: context.id,
                        details: 'Contexto de campo criado via API para o projeto.',
                    }));
                }
            }
            catch (err) {
                logger.error(`Falha ao garantir contexto de campo para ${cfg.name} no projeto ${projectId}.`, err);
                contextResults.push(buildContextResult(field.id, cfg.name, 'Contexto CS', 'failed', {
                    details: 'Falha ao garantir contexto de campo.',
                    error: err?.message,
                }));
            }
            // 3) Opções para campos select (idempotente, sem apagar opções existentes)
            if (cfg.kind === 'select' && cfg.options && cfg.options.length > 0) {
                if (!context || !context.id) {
                    optionResults.push(buildOptionResult(field.id, cfg.name, 'unknown', '', 'manual', {
                        details: 'Contexto não disponível. Opções do campo precisam ser configuradas manualmente.',
                    }));
                    continue;
                }
                try {
                    const existingOptions = await listFieldOptions(field.id, context.id);
                    const existingByValue = new Map(existingOptions.map((o) => [o.value, o]));
                    const missingValues = [];
                    for (const opt of cfg.options) {
                        const match = existingByValue.get(opt.value);
                        if (match) {
                            optionResults.push(buildOptionResult(field.id, cfg.name, context.id, opt.value, 'reused', {
                                jiraId: match.id,
                                details: 'Opção já existente foi reutilizada.',
                            }));
                        }
                        else if (mode.mode === 'audit' || mode.dryRun) {
                            optionResults.push(buildOptionResult(field.id, cfg.name, context.id, opt.value, 'skipped', {
                                details: 'Opção não existe e não foi criada em modo audit/dry-run. Em modo apply com dryRun=false, será criada.',
                            }));
                        }
                        else {
                            missingValues.push(opt.value);
                        }
                    }
                    if (missingValues.length > 0 && !(mode.mode === 'audit' || mode.dryRun)) {
                        const createdOptions = await createFieldOptions(field.id, context.id, missingValues);
                        const createdByValue = new Map(createdOptions.map((o) => [o.value, o]));
                        for (const value of missingValues) {
                            const created = createdByValue.get(value);
                            optionResults.push(buildOptionResult(field.id, cfg.name, context.id, value, 'created', {
                                jiraId: created?.id,
                                details: 'Opção criada via API.',
                            }));
                        }
                    }
                }
                catch (err) {
                    logger.error(`Falha ao garantir opções do campo ${cfg.name} no projeto ${projectId}.`, err);
                    for (const opt of cfg.options) {
                        optionResults.push(buildOptionResult(field.id, cfg.name, context?.id || 'unknown', opt.value, 'failed', {
                            details: 'Falha ao garantir opção do campo.',
                            error: err?.message,
                        }));
                    }
                }
            }
        }
        catch (err) {
            logger.error(`Erro inesperado ao garantir campo ${cfg.name}.`, err);
            fieldResults.push(buildFieldResult(cfg, 'failed', {
                details: 'Erro inesperado ao garantir campo.',
                error: err?.message,
            }));
        }
    }
    return {
        fieldResults,
        contextResults,
        optionResults,
    };
}
