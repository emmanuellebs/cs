"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFiltersProvisionConfig = loadFiltersProvisionConfig;
function loadFiltersProvisionConfig() {
    const filters = [
        {
            key: 'boardBase',
            name: 'CSM - Board base',
            description: 'Filtro base para o board Kanban de lifecycle.',
            jqlTemplate: 'project = {projectKey} ORDER BY updated DESC',
            isBoardBase: true,
        },
        {
            key: 'clientsAtRisk',
            name: 'CSM - Clientes em risco',
            description: 'Clientes com risco de churn identificado.',
            jqlTemplate: 'project = {projectKey} AND "Status da conta" = "Risco" ORDER BY updated DESC',
        },
        {
            key: 'upcomingRenewals',
            name: 'CSM - Renovações próximas',
            description: 'Contas com renovação próxima.',
            jqlTemplate: 'project = {projectKey} AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("\\u002b90d") ORDER BY "Data de renovação" ASC',
        },
        {
            key: 'noRecentInteractions',
            name: 'CSM - Clientes sem interação recente',
            description: 'Clientes sem interações nos últimos 60 dias.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Conta Cliente" AND updated <= -60d ORDER BY updated ASC',
        },
        {
            key: 'openOpportunities',
            name: 'CSM - Oportunidades em aberto',
            description: 'Oportunidades CS ainda em andamento.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Oportunidade CS" AND statusCategory != Done ORDER BY created DESC',
        },
        {
            key: 'accountsByLifecycle',
            name: 'CSM - Contas por estágio do lifecycle',
            description: 'Visão geral por estágio de lifecycle.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Conta Cliente"',
        },
        {
            key: 'activeAccounts',
            name: 'CSM - Contas ativas',
            description: 'Contas em estágio de cliente ativo.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Conta Cliente" AND "Status da conta" = "Ativo"',
        },
        {
            key: 'churnedAccounts',
            name: 'CSM - Contas churnadas',
            description: 'Contas marcadas como churn.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Conta Cliente" AND "Status da conta" = "Churn"',
        },
        {
            key: 'interactionsThisMonth',
            name: 'CSM - Interações do mês',
            description: 'Interações registradas no mês atual.',
            jqlTemplate: 'project = {projectKey} AND issuetype = "Interação" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC',
        },
    ];
    return { filters };
}
