"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManualSteps = generateManualSteps;
exports.generateAutomationBlueprint = generateAutomationBlueprint;
exports.generateFieldMapping = generateFieldMapping;
exports.generateJqlFilters = generateJqlFilters;
exports.generateDashboardSetup = generateDashboardSetup;
exports.generateProjectArchitecture = generateProjectArchitecture;
exports.generateAllDocumentation = generateAllDocumentation;
const fileWriter_1 = require("../utils/fileWriter");
const logger_1 = require("../utils/logger");
const fieldsConfig_1 = require("../config/fieldsConfig");
const filtersConfig_1 = require("../config/filtersConfig");
const dashboardsConfig_1 = require("../config/dashboardsConfig");
const projectConfig_1 = require("../config/projectConfig");
const logger = new logger_1.Logger({ module: 'documentationService' });
function sectionFromItems(title, items, includeDetails = true) {
    if (!items.length) {
        return `## ${title}\n\nNenhum item processado.\n\n`;
    }
    const counts = items.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {});
    let md = `## ${title}\n\n`;
    md += `Status por categoria: ${Object.entries(counts)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ')}\n\n`;
    if (includeDetails) {
        md += '| Chave | Nome | Status | Detalhes |\n';
        md += '| ----- | ---- | ------ | -------- |\n';
        for (const i of items) {
            md += `| ${i.key} | ${i.name ?? ''} | ${i.status} | ${i.details ? i.details.replace(/\|/g, '\\|') : ''} |\n`;
        }
        md += '\n';
    }
    return md;
}
function generateManualSteps(report) {
    const manualOrFailed = [];
    const add = (arr) => manualOrFailed.push(...arr.filter((i) => i.status === 'manual' || i.status === 'failed'));
    if (report.project) {
        if (report.project.status === 'manual' || report.project.status === 'failed') {
            manualOrFailed.push(report.project);
        }
    }
    add(report.issueTypes);
    add(report.fields);
    add(report.fieldContexts);
    add(report.fieldOptions);
    add(report.filters);
    add(report.boards);
    add(report.dashboards);
    const { jira } = (0, projectConfig_1.loadProjectProvisionConfig)();
    let md = `# Passos manuais necessários\n\n`;
    md += `Este arquivo consolida itens que não puderam ser totalmente provisionados via API no projeto **${jira.projectKey} - ${jira.projectName}**.\n\n`;
    if (!manualOrFailed.length) {
        md += 'Nenhuma pendência manual identificada pelo provisionador.\n';
    }
    else {
        md += '## Itens com status manual/failed\n\n';
        md += '| Recurso | Nome | Status | Detalhes |\n';
        md += '| ------- | ---- | ------ | -------- |\n';
        for (const i of manualOrFailed) {
            md += `| ${i.key} | ${i.name ?? ''} | ${i.status} | ${i.details ? i.details.replace(/\|/g, '\\|') : ''} |\n`;
        }
        md += '\n';
    }
    md += '## Workflow recomendado (lifecycle da Conta Cliente)\n\n';
    md +=
        '- **Estados principais**: Onboarding → Ativo → Engajamento → Expansão → Advocacy → Renovação → Renovado\n' +
            '- **Estados adicionais**: Risco, Churn\n\n' +
            '### Recomendações de configuração manual\n\n' +
            '- Criar um workflow específico para o issue type **Conta Cliente** com os estados acima.\n' +
            '- Habilitar transições:\n' +
            '  - Onboarding → Ativo\n' +
            '  - Ativo → Engajamento → Expansão → Advocacy\n' +
            '  - Advocacy → Renovação → Renovado\n' +
            '  - De qualquer estado não final para **Risco** e **Churn**, conforme regra de negócio.\n' +
            '- Associar o workflow a um workflow scheme aplicado ao projeto de CS.\n\n';
    md += '## Configuração manual do board Kanban\n\n';
    md +=
        'Após a criação do board Kanban (automática ou manual), configurar as colunas para mapear os estados do workflow:\n\n' +
            '- **Onboarding** → status: Onboarding\n' +
            '- **Cliente Ativo** → status: Ativo\n' +
            '- **Engajamento** → status: Engajamento\n' +
            '- **Expansão** → status: Expansão\n' +
            '- **Advocacy** → status: Advocacy\n' +
            '- **Renovação** → status: Renovação\n' +
            '- **Clientes Renovados** → status: Renovado\n' +
            '- **Risco** → status: Risco\n' +
            '- **Churn** → status: Churn\n\n';
    (0, fileWriter_1.writeTextFile)('docs/MANUAL_STEPS.md', md);
    logger.info('docs/MANUAL_STEPS.md gerado.');
}
function generateAutomationBlueprint() {
    const md = `# Blueprint de automações Jira (Customer Success)\n
Cada regra abaixo deve ser criada manualmente no **Jira Automation**.\n
## Regra 1 - Renovação 90 dias antes\n
- **Objetivo**: Antecipar o processo de renovação criando um registro estruturado.\n- **Gatilho**: Agendado diariamente.\n- **Condição**: \n  - JQL: issues do tipo **Conta Cliente** com campo **Data de renovação** em 90 dias.\n- **Ação**:\n  - Criar issue do tipo **Renovação** vinculada à conta.\n- **Tipo de issue gerado**: Renovação.\n- **Observações**: Usar campo de vínculo (ex.: Issue linked) para relacionar com a Conta Cliente.\n
## Regra 2 - Renovação 60 dias antes\n
- **Objetivo**: Alertar o CSM de que a renovação está se aproximando.\n- **Gatilho**: Agendado diariamente.\n- **Condição**:\n  - JQL: Contas com Data de renovação em 60 dias.\n- **Ação**:\n  - Enviar notificação/email para o CSM responsável (assignee da Conta Cliente ou campo dedicado).\n- **Tipo de issue gerado**: Não gera issue, apenas alerta.\n- **Observações**: Pode usar ação de email ou Slack (se integrado).\n
## Regra 3 - Renovação 30 dias antes\n
- **Objetivo**: Exigir uma reunião obrigatória de renovação.\n- **Gatilho**: Agendado diariamente.\n- **Condição**:\n  - JQL: Contas com Data de renovação em 30 dias.\n- **Ação**:\n  - Criar tarefa (ex.: issue type **Onboarding Task** ou **Task**) para reunião de renovação.\n- **Tipo de issue gerado**: Tarefa operacional de renovação.\n- **Observações**: Criar subtarefas específicas se necessário.\n
## Regra 4 - Risco de churn\n
- **Objetivo**: Abrir um registro formal de risco e plano de recuperação.\n- **Gatilho**: Issue updated.\n- **Condição**:\n  - Health Score < 60 **ou** Sentimento do cliente = Negativo.\n- **Ação**:\n  - Criar issue do tipo **Risco** vinculada à Conta Cliente.\n- **Tipo de issue gerado**: Risco.\n- **Observações**: Preencher campos de motivo, probabilidade e plano de ação a partir de templates.\n
## Regra 5 - Falta de relacionamento\n
- **Objetivo**: Evitar perda de relacionamento por falta de contato.\n- **Gatilho**: Agendado diariamente.\n- **Condição**:\n  - JQL: Contas sem issues do tipo **Interação** nos últimos 60 dias.\n- **Ação**:\n  - Criar ação/tarefa de contato para o CSM.\n- **Tipo de issue gerado**: Pode ser **Interação** ou **Onboarding Task**.\n- **Observações**: Usar comentários automáticos com contexto do último contato.\n
## Regra 6 - Expansão\n
- **Objetivo**: Identificar oportunidades de expansão a partir de alto engajamento.\n- **Gatilho**: Issue updated ou agendado.\n- **Condição**:\n  - Engajamento da plataforma = Alto **e/ou** Health Score acima de limiar (ex.: > 80).\n- **Ação**:\n  - Criar issue do tipo **Oportunidade CS**.\n- **Tipo de issue gerado**: Oportunidade CS.\n- **Observações**: Pode incluir valor estimado e próxima etapa sugerida.\n`;
    (0, fileWriter_1.writeTextFile)('docs/AUTOMATION_BLUEPRINT.md', md);
    logger.info('docs/AUTOMATION_BLUEPRINT.md gerado.');
}
function generateFieldMapping(report) {
    const fieldsConfig = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    let md = '# Mapeamento de campos customizados (CS)\n\n';
    md +=
        'Esta tabela relaciona cada campo lógico do provisionador com o campo real no Jira, incluindo status, tipo e opções para selects.\n\n';
    md += '| Chave lógica | Nome | Grupo | Tipo | Status | Field ID | Opções (select) |\n';
    md += '| ------------ | ---- | ----- | ---- | ------ | -------- | ---------------- |\n';
    for (const cfg of fieldsConfig.fields) {
        const result = report.fields.find((f) => f.key === `field:${cfg.key}`);
        const status = result?.status ?? 'skipped';
        const fieldId = result?.jiraId ?? '';
        const options = cfg.options && cfg.options.length
            ? cfg.options.map((o) => o.value).join(', ')
            : '';
        md += `| ${cfg.key} | ${cfg.name} | ${cfg.group} | ${cfg.kind} | ${status} | ${fieldId} | ${options} |\n`;
    }
    (0, fileWriter_1.writeTextFile)('docs/FIELD_MAPPING.md', md);
    logger.info('docs/FIELD_MAPPING.md gerado.');
}
function generateJqlFilters(report) {
    const filtersConfig = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    let md = '# Filtros JQL base (CS)\n\n';
    md += 'Lista dos filtros recomendados para o processo de Customer Success.\n\n';
    for (const cfg of filtersConfig.filters) {
        const result = report.filters.find((f) => f.key === `filter:${cfg.key}`);
        const jql = (result?.metadata && result.metadata['jql']) ||
            cfg.jqlTemplate.replace(/{projectKey}/g, (0, projectConfig_1.loadProjectProvisionConfig)().jira.projectKey);
        md += `## ${cfg.name}\n\n`;
        if (cfg.description) {
            md += `${cfg.description}\n\n`;
        }
        md += `- **Status**: ${result?.status ?? 'not-executed'}\n`;
        md += `- **Filtro ID**: ${result?.jiraId ?? 'n/d'}\n`;
        md += `- **JQL**:\n\n`;
        md += '```text\n' + jql + '\n```\n\n';
    }
    (0, fileWriter_1.writeTextFile)('docs/JQL_FILTERS.md', md);
    logger.info('docs/JQL_FILTERS.md gerado.');
}
function generateDashboardSetup(report) {
    const dashboardsConfig = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    let md = '# Configuração de dashboards (CS)\n\n';
    md +=
        'Os dashboards podem ser criados parcialmente via API. Abaixo segue o blueprint completo para montagem manual de gadgets.\n\n';
    for (const cfg of dashboardsConfig.dashboards) {
        const result = report.dashboards.find((d) => d.key === `dashboard:${cfg.key}`);
        md += `## ${cfg.name}\n\n`;
        if (cfg.description) {
            md += `${cfg.description}\n\n`;
        }
        md += `- **Status**: ${result?.status ?? 'not-executed'}\n`;
        md += `- **Dashboard ID**: ${result?.jiraId ?? 'n/d'}\n\n`;
        md += '### Gadgets recomendados\n\n';
        md += '| Gadget | Tipo sugerido |\n';
        md += '| ------ | ------------- |\n';
        for (const gadget of cfg.gadgets) {
            md += `| ${gadget.name} | ${gadget.gadgetTypeHint ?? ''} |\n`;
        }
        md += '\n';
    }
    (0, fileWriter_1.writeTextFile)('docs/DASHBOARD_SETUP.md', md);
    logger.info('docs/DASHBOARD_SETUP.md gerado.');
}
function generateProjectArchitecture() {
    const md = `# Arquitetura do projeto jira-cs-provisioning\n
## Visão geral\n
O projeto é um provisionador de estrutura de Customer Success no Jira Cloud, escrito em **Node.js + TypeScript**, com foco em:\n
- Idempotência (reexecução segura)\n- Modos **audit-only** e **apply**\n- Geração de documentação complementar para configurações manuais.\n
## Camadas principais\n
- \`config/\`: arquivos de configuração (projeto, issue types, campos, filtros, boards, dashboards, runtime).\n- \`clients/\`: clientes HTTP para Jira REST e Jira Agile.\n- \`services/\`: lógica de integração com a API (auth, projeto, issue types, campos, filtros, boards, dashboards, documentação).\n- \`provisioning/\`: (planejado) orquestradores por domínio, coordenando os services.\n- \`utils/\`: utilitários de logging, IO e tipos compartilhados.\n
## Fluxo principal\n
1. Carrega runtime (modo audit/apply, dry-run) e configurações de ambiente.\n2. Valida autenticação com \`/rest/api/3/myself\`.\n3. Garante a existência do projeto (reutiliza ou cria, conforme modo).\n4. Garante issue types, campos, contextos e opções, filtros, board Kanban e dashboards.\n5. Gera um relatório estruturado de provisionamento em \`outputs/provisioning-summary.*\`.\n6. Gera documentação complementar em \`docs/*.md\`.\n
## Decisões de design\n
- **Nenhuma falha isolada** interrompe o provisionamento completo; cada item é marcado com \`created\`, \`reused\`, \`skipped\`, \`manual\` ou \`failed\`.\n- **Workflows e colunas de board** não são configurados por API, apenas documentados.\n- **Dashboards e gadgets** são parcialmente automatizados (criação de dashboards) e complementados com blueprint manual.\n`;
    (0, fileWriter_1.writeTextFile)('docs/PROJECT_ARCHITECTURE.md', md);
    logger.info('docs/PROJECT_ARCHITECTURE.md gerado.');
}
function generateAllDocumentation(report) {
    generateManualSteps(report);
    generateAutomationBlueprint();
    generateFieldMapping(report);
    generateJqlFilters(report);
    generateDashboardSetup(report);
    generateProjectArchitecture();
}
