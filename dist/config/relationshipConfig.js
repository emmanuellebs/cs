"use strict";
/**
 * Configuração de relacionamentos entre issue types.
 * Define como as entidades do sistema se relacionam através de linked issues.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRelationshipsProvisionConfig = loadRelationshipsProvisionConfig;
/**
 * Carrega a configuração de relacionamentos obrigatórios.
 * Cliente é a entidade central. Interação, Plano de Sucesso, Risco,
 * Oportunidade e Renovação são vinculados ao Cliente via linked issues.
 */
function loadRelationshipsProvisionConfig() {
    return {
        relationships: [
            {
                sourceType: 'Cliente',
                targetType: 'Interação',
                linkType: 'relates to',
                description: 'Histórico de relacionamento com o cliente',
            },
            {
                sourceType: 'Cliente',
                targetType: 'Plano de Sucesso',
                linkType: 'relates to',
                description: 'Estratégia de sucesso para a conta',
            },
            {
                sourceType: 'Cliente',
                targetType: 'Risco',
                linkType: 'relates to',
                description: 'Fatores de risco identificados para prevenção de churn',
            },
            {
                sourceType: 'Cliente',
                targetType: 'Oportunidade',
                linkType: 'relates to',
                description: 'Oportunidades de expansão identificadas',
            },
            {
                sourceType: 'Cliente',
                targetType: 'Renovação',
                linkType: 'relates to',
                description: 'Processo de renovação contratual',
            },
        ],
    };
}
