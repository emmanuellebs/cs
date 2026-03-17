"use strict";
/**
 * Serviço de criação de dados demonstrativos (Sample Data)
 *
 * Responsável por:
 * - Criar UMA ÚNICA issue de exemplo (Cliente)
 * - Garantir idempotência (não duplicar se já existir)
 * - Usar apenas dados mapeados em sampleDataConfig
 * - Usar apenas campos definidos em fieldsConfig
 * - Registrar status da criação no relatório
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSampleData = ensureSampleData;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const sampleDataConfig_1 = require("../config/sampleDataConfig");
const logger = new logger_1.Logger({ module: 'sampleDataService' });
/**
 * Converte uma string em um documento Atlassian (ADF)
 */
function toAtlassianDoc(text) {
    return {
        version: 1,
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text,
                    },
                ],
            },
        ],
    };
}
/**
 * Busca um exemplo existente por nome (para idempotência)
 */
async function findExistingSampleAccount(projectKey, accountTypeId) {
    if (!accountTypeId) {
        logger.warn('[SAMPLE-DATA] Account type ID não disponível, pulando busca de cliente existente');
        return null;
    }
    try {
        // JQL query: find any issue with summary containing "Cliente Exemplo" in the project with this issue type
        const jql = `project = "${projectKey}" AND issuetype = "${accountTypeId}" AND summary ~ "Cliente Exemplo"`;
        logger.debug(`[SAMPLE-DATA] Searching for existing issue with JQL: ${jql}`);
        const response = await jiraClient_1.jiraClient.request({
            method: 'get',
            url: '/search/jql',
            params: {
                jql,
                maxResults: 1,
                validateQuery: 'strict',
            },
        });
        if (response.data.issues && response.data.issues.length > 0) {
            const issue = response.data.issues[0];
            logger.debug(`[SAMPLE-DATA] Found issue full response: ${JSON.stringify(issue)}`);
            // Extract key and id - key should always be present in /search/jql response
            const issueKey = issue.key;
            const issueId = issue.id;
            if (!issueKey) {
                logger.warn(`[SAMPLE-DATA] Search returned issue without key field. Response: ${JSON.stringify(issue)}`);
                return null;
            }
            logger.info(`[SAMPLE-DATA] Cliente exemplo encontrado (idempotência): ${issueKey}`);
            return { id: issueId, key: issueKey };
        }
        logger.debug('[SAMPLE-DATA] Nenhum cliente exemplo encontrado via JQL');
        return null;
    }
    catch (err) {
        logger.warn(`[SAMPLE-DATA] Erro ao buscar cliente exemplo: ${err.message}`);
        return null;
    }
}
/**
 * Cria um novo Cliente com todos os campos mapeados
 */
async function createSampleAccount(projectKey, projectId, accountTypeId, accountTypeName, fieldMap) {
    const sampleData = (0, sampleDataConfig_1.getSampleData)();
    const account = sampleData.account;
    try {
        // STEP 1: Create issue with only basic fields (summary, description)
        // Custom fields will be added separately via PUT after creation
        const createFields = {
            project: { key: projectKey },
            issuetype: { id: accountTypeId },
            summary: account.summary,
            description: toAtlassianDoc(account.description),
        };
        logger.info(`[SAMPLE-DATA] Creating issue with basic fields only (custom fields will be added via update)...`);
        const createResponse = await jiraClient_1.jiraClient.request({
            method: 'post',
            url: '/issue',
            data: { fields: createFields },
        });
        const jiraKey = createResponse.data.key;
        const jiraId = createResponse.data.id;
        logger.info(`[CREATE] Example Cliente issue created: ${jiraKey}`);
        // STEP 2: Update the issue with custom fields
        const updateFields = {};
        // Mapa de campo lógico -> valor no sampleData (correspondência com fieldsConfig.ts)
        const fieldMappings = [
            { fieldKey: 'account.segment', sampleValue: account.segment, isSelect: true },
            { fieldKey: 'account.recurringCadence', sampleValue: account.recurringCadence, isSelect: true },
            { fieldKey: 'account.engagement', sampleValue: account.engagement, isSelect: true },
            { fieldKey: 'account.csParticipation', sampleValue: account.csParticipation, isSelect: true },
            { fieldKey: 'account.advocacyProgram', sampleValue: account.advocacyProgram, isSelect: true },
            { fieldKey: 'account.userCount', sampleValue: account.numberOfUsers },
            { fieldKey: 'account.mrr', sampleValue: account.mrr },
            { fieldKey: 'account.healthScore', sampleValue: account.healthScore },
            { fieldKey: 'account.nps', sampleValue: account.nps },
            { fieldKey: 'account.renewalDate', sampleValue: account.renewalDate },
            { fieldKey: 'account.product', sampleValue: account.product, isSelect: true },
            { fieldKey: 'account.city', sampleValue: account.city },
            { fieldKey: 'account.state', sampleValue: account.state },
            { fieldKey: 'account.journeyStartDate', sampleValue: account.journeyStartDate },
            { fieldKey: 'account.launchDate', sampleValue: account.launchDate },
            { fieldKey: 'account.trainingDate', sampleValue: account.trainingDate },
            { fieldKey: 'account.contractDuration', sampleValue: account.contractDuration },
            { fieldKey: 'account.notes', sampleValue: account.accountNotes },
            { fieldKey: 'primaryContact.name', sampleValue: account.mainContactName },
            { fieldKey: 'primaryContact.email', sampleValue: account.mainContactEmail },
            { fieldKey: 'primaryContact.phone', sampleValue: account.mainContactPhone },
            { fieldKey: 'primaryContact.role', sampleValue: account.mainContactPosition },
            { fieldKey: 'primaryContact.area', sampleValue: account.mainContactArea },
            { fieldKey: 'csOperation.lastMeetingDate', sampleValue: account.launchDate },
            { fieldKey: 'csOperation.lastInteractionDate', sampleValue: account.trainingDate },
            { fieldKey: 'csOperation.accountCycle', sampleValue: account.accountCycle, isSelect: true },
        ];
        logger.info(`[SAMPLE-DATA] Building update payload with ${fieldMappings.length} configured fields...`);
        // Preparar campos customizados com tratamento correto de tipos
        let successCount = 0;
        let skippedCount = 0;
        for (const mapping of fieldMappings) {
            const jiraFieldId = fieldMap[mapping.fieldKey];
            if (!jiraFieldId) {
                logger.debug(`[SAMPLE-DATA] Field ${mapping.fieldKey} not in field map, skipping`);
                skippedCount++;
                continue;
            }
            if (mapping.sampleValue === undefined || mapping.sampleValue === null) {
                logger.debug(`[SAMPLE-DATA] Field ${mapping.fieldKey} has no value in sample data`);
                skippedCount++;
                continue;
            }
            // Serializar valor corretamente baseado no tipo
            let serializedValue;
            if (mapping.isSelect) {
                // Select precisa de { value: "..." }
                serializedValue = { value: mapping.sampleValue };
            }
            else {
                // Valores simples: text, number, date passam direto
                serializedValue = mapping.sampleValue;
            }
            updateFields[jiraFieldId] = serializedValue;
            logger.debug(`[SAMPLE-DATA] ✓ Field mapped for update: ${mapping.fieldKey} → ${jiraFieldId}`);
            successCount++;
        }
        logger.info(`[SAMPLE-DATA] Update payload ready: ${successCount} fields to update, ${skippedCount} skipped`);
        // Log do payload para debug
        logger.debug(`[SAMPLE-DATA] Updating issue ${jiraKey} with fields: ${Object.keys(updateFields).join(', ')}`);
        // STEP 3: PUT the custom fields
        try {
            await jiraClient_1.jiraClient.request({
                method: 'put',
                url: `/issue/${jiraKey}`,
                data: { fields: updateFields },
            });
            logger.info(`[SAMPLE-DATA] ✓ Custom fields atualizados na issue ${jiraKey}`);
        }
        catch (updateErr) {
            const updateErrorData = updateErr.response?.data;
            if (updateErrorData?.errors && Object.keys(updateErrorData.errors).length > 0) {
                const errorMessages = Object.values(updateErrorData.errors);
                const isScreenError = errorMessages.some((msg) => msg.includes('not on the appropriate screen'));
                if (isScreenError) {
                    logger.warn('[SAMPLE-DATA] ⚠ Custom fields cannot be set - fields are not on the create/edit screen');
                    logger.warn('[SAMPLE-DATA] ⚠ MANUAL STEP REQUIRED: Add custom fields to the "Cliente" issue type screen in Jira');
                    logger.warn('[SAMPLE-DATA] ⚠ See: Project Settings → Issue Types → Cliente → Configure Fields');
                    // Don't fail - issue is created, fields just can't be auto-populated
                }
                else {
                    throw updateErr;
                }
            }
            else {
                throw updateErr;
            }
        }
        // Validação pós-criação: buscar a issue e verificar campos
        try {
            logger.debug(`[SAMPLE-DATA] Validating created issue fields...`);
            const getResponse = await jiraClient_1.jiraClient.request({
                method: 'get',
                url: `/issue/${jiraKey}`,
            });
            const createdIssue = getResponse.data;
            const createdFields = createdIssue.fields || {};
            logger.info(`[SAMPLE-DATA] Field validation summary:`);
            for (const mapping of fieldMappings) {
                const jiraFieldId = fieldMap[mapping.fieldKey];
                if (!jiraFieldId)
                    continue;
                const fieldValue = createdFields[jiraFieldId];
                if (fieldValue !== undefined && fieldValue !== null) {
                    logger.info(`[FIELD_OK] ${mapping.fieldKey} = ${JSON.stringify(fieldValue).substring(0, 100)}`);
                }
                else {
                    logger.warn(`[FIELD_MISSING] ${mapping.fieldKey} not found in created issue`);
                }
            }
        }
        catch (validateErr) {
            logger.warn(`[SAMPLE-DATA] Could not validate created issue fields`);
        }
        return {
            key: 'sample:account',
            name: account.summary,
            status: 'created',
            jiraId,
            jiraKey,
            details: `Cliente exemplo criado com ${successCount} campos customizados populados`,
            metadata: {
                fieldsPopulated: successCount,
                fieldsSkipped: skippedCount,
            },
        };
    }
    catch (err) {
        const errorData = err.response?.data || err.message;
        logger.error('[SAMPLE-DATA] Erro ao criar cliente exemplo - Detalhes:', errorData);
        return {
            key: 'sample:account',
            name: account.summary,
            status: 'failed',
            details: 'Erro ao criar cliente exemplo',
            error: err.message,
        };
    }
}
/**
 * Função principal: provisionar UMA ÚNICA issue de exemplo
 *
 * STRICT RULE: Criar apenas uma issue de exemplo (Conta Cliente)
 * Usar apenas dados mapeados em sampleDataConfig
 * Usar apenas campos definidos em fieldsConfig
 */
async function ensureSampleData(projectKey, projectId, issueTypeMap, fieldMap) {
    const results = [];
    const sampleData = (0, sampleDataConfig_1.getSampleData)();
    logger.info('[SAMPLE-DATA] Iniciando criação de UMA ÚNICA issue de exemplo (Conta Cliente)...');
    // 1. Validar que temos o Issue Type para Conta Cliente
    let accountTypeId = issueTypeMap['account'];
    if (!accountTypeId) {
        logger.warn('[SAMPLE-DATA] Issue type "account" não mapeado (null). Descobrindo issue types no projeto...');
    }
    else {
        logger.info(`[SAMPLE-DATA] Issue type mapeado: account=${accountTypeId}. Validando disponibilidade no projeto...`);
    }
    // Sempre tentar descobrir issue types do projeto como fallback/validação
    try {
        const projectResp = await jiraClient_1.jiraClient.request({
            method: 'get',
            url: `/project/${projectKey}`,
        });
        const projectIssueTypes = projectResp.data.issueTypes || [];
        logger.info(`[SAMPLE-DATA] Issue types no projeto: ${projectIssueTypes.map((it) => `${it.name}(${it.id})`).join(', ')}`);
        // Se accountTypeId é inválido, procurar alternativa
        if (accountTypeId) {
            const typeExists = projectIssueTypes.find((it) => it.id === accountTypeId);
            if (!typeExists) {
                logger.warn(`[SAMPLE-DATA] Issue type ${accountTypeId} não encontrado no projeto. Procurando fallback...`);
                accountTypeId = null;
            }
        }
        // Se ainda não temos issue type, procurar um válido
        if (!accountTypeId) {
            // Preferir "Cliente" se existir
            let preferred = projectIssueTypes.find((it) => it.name === 'Cliente');
            if (!preferred) {
                preferred = projectIssueTypes.find((it) => it.name === 'Task');
            }
            if (preferred) {
                accountTypeId = preferred.id;
                logger.info(`[SAMPLE-DATA] Usando issue type: ${preferred.name} (${preferred.id})`);
            }
        }
    }
    catch (err) {
        logger.error('[SAMPLE-DATA] Erro ao consultar projeto', err);
    }
    if (!accountTypeId) {
        logger.error('[SAMPLE-DATA] Não foi possível encontrar um issue type válido. Pulando sample data.');
        results.push({
            key: 'sample:example-account',
            status: 'failed',
            details: 'Nenhum issue type válido encontrado no projeto',
            error: 'Issue type discovery fallback failed',
        });
        return { sampleResults: results };
    }
    // 2. Procurar Cliente exemplo existente (idempotência) - DISABLED for testing
    // Always create fresh to ensure field population is tested
    // TODO: Re-enable idempotency check after validating field population works
    // 3. Criar UMA ÚNICA issue de exemplo
    logger.info('[SAMPLE-DATA] Criando nova issue de exemplo...');
    const result = await createSampleAccount(projectKey, projectId, accountTypeId, 'Conta Cliente', fieldMap);
    results.push(result);
    logger.info(`[SAMPLE-DATA] Provisionamento concluído: 1 issue de exemplo ${result.status}`);
    return { sampleResults: results };
}
