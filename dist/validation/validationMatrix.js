"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidationMatrix = generateValidationMatrix;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const fieldsConfig_1 = require("../config/fieldsConfig");
const issueTypesConfig_1 = require("../config/issueTypesConfig");
const boardConfig_1 = require("../config/boardConfig");
const filtersConfig_1 = require("../config/filtersConfig");
const dashboardsConfig_1 = require("../config/dashboardsConfig");
const fileWriter_1 = require("../utils/fileWriter");
function expectedCustomType(kind) {
    switch (kind) {
        case 'number':
            return 'com.atlassian.jira.plugin.system.customfieldtypes:float';
        case 'date':
            return 'com.atlassian.jira.plugin.system.customfieldtypes:datepicker';
        case 'paragraph':
            return 'com.atlassian.jira.plugin.system.customfieldtypes:textarea';
        case 'select':
            return 'com.atlassian.jira.plugin.system.customfieldtypes:select';
        case 'userPicker':
            return 'com.atlassian.jira.plugin.system.customfieldtypes:userpicker';
        case 'text':
        default:
            return 'com.atlassian.jira.plugin.system.customfieldtypes:textfield';
    }
}
async function listAllFields() {
    const resp = await jiraClient_1.jiraClient.request({ url: '/field', method: 'GET' });
    return resp.data || [];
}
async function listContexts(fieldId) {
    const resp = await jiraClient_1.jiraClient.request({
        url: `/field/${encodeURIComponent(fieldId)}/context`,
        method: 'GET',
    });
    return resp.data?.values || [];
}
function yesNo(value) {
    return value ? 'sim' : 'não';
}
async function generateValidationMatrix(input) {
    const logger = new logger_1.Logger({ module: 'validationMatrix' });
    logger.info('[VALIDATE] Iniciando geração da matriz de validação...');
    const fieldsCfg = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    const issueTypesCfg = (0, issueTypesConfig_1.loadIssueTypesProvisionConfig)();
    const boardCfg = (0, boardConfig_1.loadBoardProvisionConfig)();
    const filtersCfg = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const dashboardsCfg = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    const allFields = await listAllFields();
    const fieldsById = new Map(allFields.map((f) => [f.id, f]));
    const fieldsByName = new Map(allFields.map((f) => [f.name, f]));
    // Dados de create/edit meta e issue para validação de tela
    let createFields = {};
    let editFields = {};
    let issueFields = {};
    if (input.issueTypeId) {
        try {
            const cm = await jiraClient_1.jiraClient.request({
                method: 'get',
                url: '/issue/createmeta',
                params: {
                    projectIds: input.projectId,
                    issuetypeIds: input.issueTypeId,
                    expand: 'projects.issuetypes.fields',
                },
            });
            const project = cm.data.projects?.[0];
            const issueType = project?.issuetypes?.[0];
            createFields = issueType?.fields || {};
            logger.info('[VALIDATE] createMeta carregado para Cliente');
        }
        catch (err) {
            logger.warn('[VALIDATE] Não foi possível carregar createMeta para validação de telas');
        }
    }
    if (input.sampleIssueKey) {
        try {
            const em = await jiraClient_1.jiraClient.request({
                method: 'get',
                url: `/issue/${input.sampleIssueKey}/editmeta`,
            });
            editFields = em.data.fields || {};
        }
        catch (err) {
            logger.warn('[VALIDATE] Não foi possível carregar editmeta da issue exemplo');
        }
        try {
            const issueResp = await jiraClient_1.jiraClient.request({
                method: 'get',
                url: `/issue/${input.sampleIssueKey}`,
            });
            issueFields = issueResp.data.fields || {};
        }
        catch (err) {
            logger.warn('[VALIDATE] Não foi possível carregar a issue exemplo para validação de valores');
        }
    }
    let md = '# Matriz de validação\n\n';
    // Campos
    md += '## Campos (Cliente)\n\n';
    md +=
        '| Nome | Tipo esperado | Jira Field ID | Existe? | Tipo compatível? | Contexto inclui projeto? | Utilizável em Cliente? | Disponível no create? | Disponível no edit/view? | Preenchido no exemplo? | Observação |\n';
    md +=
        '| ---- | ------------- | ------------- | ------- | ---------------- | ------------------------ | ---------------------- | --------------------- | ----------------------- | ---------------------- | ----------- |\n';
    for (const cfg of fieldsCfg.fields) {
        const expectedType = expectedCustomType(cfg.kind);
        const jiraIdFromMap = input.fieldMap[cfg.key];
        const jiraField = (jiraIdFromMap && fieldsById.get(jiraIdFromMap)) || fieldsByName.get(cfg.name);
        const jiraId = jiraField?.id || jiraIdFromMap || '';
        const exists = Boolean(jiraField);
        const typeCompatible = exists && (jiraField.schema?.custom || jiraField.schema?.type) === expectedType;
        let contextIncludesProject = false;
        let contextIncludesIssueType = false;
        if (jiraId) {
            try {
                const contexts = await listContexts(jiraId);
                contextIncludesProject = contexts.some((c) => c.projectIds?.includes(input.projectId));
                if (input.issueTypeId) {
                    contextIncludesIssueType = contexts.some((c) => !c.issueTypeIds?.length ||
                        (c.issueTypeIds && c.issueTypeIds.includes(input.issueTypeId)));
                }
                else {
                    contextIncludesIssueType = true;
                }
            }
            catch {
                // ignore, keep defaults
            }
        }
        const availableCreate = jiraId ? createFields.hasOwnProperty(jiraId) : false;
        const availableEdit = jiraId && Object.keys(editFields).length ? editFields.hasOwnProperty(jiraId) : availableCreate;
        const availableView = jiraId ? issueFields.hasOwnProperty(jiraId) || availableEdit : false;
        const filled = jiraId && issueFields[jiraId] !== undefined && issueFields[jiraId] !== null ? true : false;
        const usable = availableCreate || availableEdit || availableView || contextIncludesIssueType;
        const observations = [];
        if (!exists)
            observations.push('Campo não encontrado no Jira');
        if (exists && !typeCompatible)
            observations.push('Tipo incompatível');
        if (exists && !contextIncludesProject)
            observations.push('Contexto não inclui o projeto');
        if (!usable)
            observations.push('Campo não aparece no Cliente');
        if (availableCreate && !filled && input.sampleIssueKey)
            observations.push('Não populado na issue exemplo');
        md += `| ${cfg.name} | ${cfg.kind} | ${jiraId || '-'} | ${yesNo(exists)} | ${yesNo(typeCompatible)} | ${yesNo(contextIncludesProject)} | ${yesNo(usable)} | ${yesNo(availableCreate)} | ${yesNo(availableEdit || availableView)} | ${yesNo(filled)} | ${observations.join('; ') || ''} |\n`;
    }
    // Issue types
    md += '\n## Issue Types\n\n';
    md += '| Nome | Existe? | ID | Associado ao projeto? | Observações |\n';
    md += '| ---- | ------- | -- | --------------------- | ----------- |\n';
    let projectIssueTypes = [];
    try {
        const projectResp = await jiraClient_1.jiraClient.request({
            method: 'get',
            url: `/project/${input.projectKey}`,
        });
        projectIssueTypes = projectResp.data.issueTypes || [];
    }
    catch (err) {
        logger.warn('[VALIDATE] Não foi possível carregar issue types do projeto');
    }
    for (const it of issueTypesCfg.issueTypes) {
        const result = input.report.issueTypes.find((r) => r.key === `issuetype:${it.key}`);
        const id = result?.jiraId || '';
        const exists = Boolean(id);
        const inProject = projectIssueTypes.some((p) => p.id === id);
        const obs = exists ? '' : 'Não criado ou não resolvido';
        md += `| ${it.name} | ${yesNo(exists)} | ${id || '-'} | ${yesNo(inProject)} | ${obs} |\n`;
    }
    // Board
    md += '\n## Board\n\n';
    md += '| Status | Existe? | Mapeado em coluna? | Nome da coluna | Observações |\n';
    md += '| ------ | ------- | ------------------ | -------------- | ----------- |\n';
    const boardResult = input.report.boards.find((b) => b.key === 'board:kanban');
    for (const col of boardCfg.columns) {
        md += `| ${col.name} | ${yesNo(Boolean(boardResult && boardResult.status !== 'failed'))} | não verificado via API | ${col.name} | Agile API não expõe colunas para projetos business; revisar manualmente |\n`;
    }
    // Filtros
    md += '\n## Filtros\n\n';
    md += '| Nome | Existe? | JQL compatível? | Observações |\n';
    md += '| ---- | ------- | --------------- | ----------- |\n';
    for (const f of filtersCfg.filters) {
        const result = input.report.filters.find((r) => r.key === `filter:${f.key}`);
        const exists = result ? result.status !== 'failed' && result.status !== 'manual' : false;
        const jql = result?.metadata && result.metadata['jql'];
        const expectedJql = f.jqlTemplate.replace(/{projectKey}/g, input.projectKey);
        const jqlOk = jql ? jql === expectedJql : false;
        md += `| ${f.name} | ${yesNo(exists)} | ${yesNo(jqlOk)} | ${exists ? '' : 'Filtro não encontrado ou falhou'} |\n`;
    }
    // Dashboards
    md += '\n## Dashboards\n\n';
    md += '| Nome | Existe? | Gadgets criados? | Observações |\n';
    md += '| ---- | ------- | ---------------- | ----------- |\n';
    for (const d of dashboardsCfg.dashboards) {
        const result = input.report.dashboards.find((r) => r.key === `dashboard:${d.key}`);
        const exists = result ? result.status !== 'failed' && result.status !== 'manual' : false;
        md += `| ${d.name} | ${yesNo(exists)} | não automatizado | ${exists ? '' : 'Criar/validar gadgets manualmente'} |\n`;
    }
    // Automações (blueprint)
    md += '\n## Automações\n\n';
    md += '| Nome | Existe? | Trigger | Ações | Status | Observações |\n';
    md += '| ---- | ------- | ------- | ------ | ------ | ----------- |\n';
    md +=
        '| Renovação 90 dias | não | Agendado diário | Criar issue Renovação vinculada ao Cliente | manual | Não há API de Automation neste provisionador; seguir blueprint docs/AUTOMATION_BLUEPRINT.md |\n';
    md +=
        '| Renovação 60 dias | não | Agendado diário | Notificar CSM | manual | Não há API de Automation neste provisionador; seguir blueprint |\n';
    md +=
        '| Renovação 30 dias | não | Agendado diário | Criar tarefa de reunião | manual | Não há API de Automation neste provisionador; seguir blueprint |\n';
    md +=
        '| Risco de churn | não | Issue updated | Criar issue Risco vinculada ao Cliente | manual | Não há API de Automation neste provisionador; seguir blueprint |\n';
    md +=
        '| Falta de relacionamento | não | Agendado diário | Criar ação de contato | manual | Não há API de Automation neste provisionador; seguir blueprint |\n';
    md +=
        '| Expansão | não | Issue updated/agendado | Criar issue Oportunidade | manual | Não há API de Automation neste provisionador; seguir blueprint |\n';
    // Issue exemplo
    md += '\n## Issue exemplo\n\n';
    const sample = input.report.sampleIssues[0];
    md += '| Issue Key | Issue Type | Status | Campos preenchidos |\n';
    md += '| --------- | ---------- | ------ | ------------------ |\n';
    md += `| ${sample?.jiraKey || '-'} | Cliente | ${sample?.status || '-'} | ${sample?.metadata?.['fieldsPopulated'] ?? ''} |\n`;
    (0, fileWriter_1.writeTextFile)('outputs/validation-matrix.md', md);
    logger.info('outputs/validation-matrix.md gerado.');
}
