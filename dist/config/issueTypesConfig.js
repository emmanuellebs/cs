"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadIssueTypesProvisionConfig = loadIssueTypesProvisionConfig;
function loadIssueTypesProvisionConfig() {
    const issueTypes = [
        {
            key: 'account',
            name: 'Cliente',
            description: 'Representa um cliente gerenciado pelo time de Customer Success.',
            fallbackStandardTypeName: 'Task',
        },
        {
            key: 'interaction',
            name: 'Interação',
            description: 'Registro de interação com o cliente (reunião, suporte, feedback, etc.).',
            fallbackStandardTypeName: 'Task',
        },
        {
            key: 'successPlan',
            name: 'Plano de Sucesso',
            description: 'Plano de sucesso do cliente, com objetivos, ações e métricas.',
            fallbackStandardTypeName: 'Task',
        },
        {
            key: 'risk',
            name: 'Risco',
            description: 'Registro de risco de churn ou outro risco relevante para a conta.',
            fallbackStandardTypeName: 'Task',
        },
        {
            key: 'opportunity',
            name: 'Oportunidade',
            description: 'Oportunidade de expansão, indicação ou outro ganho de negócio.',
            fallbackStandardTypeName: 'Task',
        },
        {
            key: 'renewal',
            name: 'Renovação',
            description: 'Registro do processo de renovação contratual da conta.',
            fallbackStandardTypeName: 'Task',
        },
    ];
    return { issueTypes };
}
