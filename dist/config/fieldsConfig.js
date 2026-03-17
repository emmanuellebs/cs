"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFieldsProvisionConfig = loadFieldsProvisionConfig;
function loadFieldsProvisionConfig() {
    const fields = [
        // ============================================================================
        // GRUPO 1: ACCOUNT (17 campos) - Dados da Conta/Cliente
        // ============================================================================
        {
            key: 'account.segment',
            name: 'Segmento',
            description: 'Segmento da conta cliente.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'Enterprise' },
                { value: 'Mid-Market' },
                { value: 'SMB' },
            ],
        },
        {
            key: 'account.userCount',
            name: 'Quantidade de usuários',
            description: 'Quantidade estimada de usuários na conta.',
            group: 'account',
            kind: 'number',
        },
        {
            key: 'account.city',
            name: 'Cidade',
            description: 'Cidade principal do cliente.',
            group: 'account',
            kind: 'text',
        },
        {
            key: 'account.state',
            name: 'Estado (UF)',
            description: 'Estado (UF) do cliente.',
            group: 'account',
            kind: 'text',
        },
        {
            key: 'account.mrr',
            name: 'MRR',
            description: 'Receita recorrente mensal associada à conta.',
            group: 'account',
            kind: 'number',
        },
        {
            key: 'account.recurringCadence',
            name: 'Recorrência de cobrança',
            description: 'Periodicidade da receita recorrente.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'Mensal' },
                { value: 'Trimestral' },
                { value: 'Anual' },
            ],
        },
        {
            key: 'account.healthScore',
            name: 'Health Score',
            description: 'Indicador numérico de saúde da conta.',
            group: 'account',
            kind: 'number',
        },
        {
            key: 'account.nps',
            name: 'NPS',
            description: 'Net Promoter Score associado ao cliente.',
            group: 'account',
            kind: 'number',
        },
        {
            key: 'account.engagement',
            name: 'Engajamento da plataforma',
            description: 'Nível de engajamento do cliente com a plataforma.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'Baixo' },
                { value: 'Médio' },
                { value: 'Alto' },
            ],
        },
        {
            key: 'account.csParticipation',
            name: 'Participação CS',
            description: 'Indica se a conta está em atendimento ativo de CS.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'Sim' },
                { value: 'Não' },
            ],
        },
        {
            key: 'account.advocacyProgram',
            name: 'Participa do programa de Advocacy',
            description: 'Indica se o cliente participa do programa de advocacy.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'Sim' },
                { value: 'Não' },
            ],
        },
        {
            key: 'account.renewalDate',
            name: 'Data de renovação',
            description: 'Data prevista de renovação contratual.',
            group: 'account',
            kind: 'date',
        },
        {
            key: 'account.product',
            name: 'Produto',
            description: 'Produto principal contratado pelo cliente.',
            group: 'account',
            kind: 'select',
            options: [
                { value: 'SaaS' },
                { value: 'Suporte' },
            ],
        },
        {
            key: 'account.journeyStartDate',
            name: 'Data de início da jornada',
            description: 'Data de início da jornada de CS para a conta.',
            group: 'account',
            kind: 'date',
        },
        {
            key: 'account.launchDate',
            name: 'Data do lançamento',
            description: 'Data de lançamento da solução para o cliente.',
            group: 'account',
            kind: 'date',
        },
        {
            key: 'account.trainingDate',
            name: 'Data do treinamento',
            description: 'Data de realização do treinamento principal com o cliente.',
            group: 'account',
            kind: 'date',
        },
        {
            key: 'account.contractDuration',
            name: 'Duração do contrato',
            description: 'Duração contratual (em meses ou texto livre).',
            group: 'account',
            kind: 'text',
        },
        {
            key: 'account.notes',
            name: 'Observações da conta',
            description: 'Notas gerais e contexto relevante da conta.',
            group: 'account',
            kind: 'paragraph',
        },
        // ============================================================================
        // GRUPO 2: PRIMARY CONTACT (5 campos) - Dados do Contato Principal
        // ============================================================================
        {
            key: 'primaryContact.name',
            name: 'Nome do contato principal',
            description: 'Nome do principal contato de negócio do cliente.',
            group: 'primaryContact',
            kind: 'text',
        },
        {
            key: 'primaryContact.email',
            name: 'Email do contato principal',
            description: 'Email do contato principal.',
            group: 'primaryContact',
            kind: 'text',
        },
        {
            key: 'primaryContact.phone',
            name: 'Telefone do contato principal',
            description: 'Telefone do contato principal.',
            group: 'primaryContact',
            kind: 'text',
        },
        {
            key: 'primaryContact.role',
            name: 'Cargo do contato principal',
            description: 'Cargo do contato.',
            group: 'primaryContact',
            kind: 'text',
        },
        {
            key: 'primaryContact.area',
            name: 'Área do contato principal',
            description: 'Área/departamento do contato.',
            group: 'primaryContact',
            kind: 'text',
        },
        // ============================================================================
        // GRUPO 3: CS OPERATION (10 campos) - Dados de Operação CS
        // ============================================================================
        // Campo estratégico: Ciclo da Conta - APENAS para issue type Cliente
        {
            key: 'csOperation.accountCycle',
            name: 'Ciclo da Conta',
            description: 'Estado estratégico do ciclo de vida da conta na jornada de CS. Valores: Onboarding (fase inicial), Ativo (em pleno uso), Adoção (aumentando utilização), Engajamento (alta participação), Expansão (crescimento de uso/valor), Advocacy (cliente promotor), Renovação (próximo período contratual), Renovado (contrato renovado), Risco (possível churn), Churn (cliente inativo/perdido). Este campo aparece APENAS em issues do tipo Cliente.',
            group: 'csOperation',
            kind: 'select',
            options: [
                { value: 'Onboarding' },
                { value: 'Ativo' },
                { value: 'Adoção' },
                { value: 'Engajamento' },
                { value: 'Expansão' },
                { value: 'Advocacy' },
                { value: 'Renovação' },
                { value: 'Renovado' },
                { value: 'Risco' },
                { value: 'Churn' },
            ],
        },
        {
            key: 'csOperation.lastMeetingDate',
            name: 'Última reunião',
            description: 'Data da última reunião com o cliente.',
            group: 'csOperation',
            kind: 'date',
        },
        {
            key: 'csOperation.lastInteractionDate',
            name: 'Última interação',
            description: 'Data da última interação registrada com o cliente.',
            group: 'csOperation',
            kind: 'date',
        },
        // ============================================================================
        // GRUPO 4: INTERACTION (6 campos) - Dados de Interação
        // ============================================================================
        {
            key: 'interaction.type',
            name: 'Tipo de interação',
            description: 'Tipo de interação registrada.',
            group: 'interaction',
            kind: 'select',
            options: [
                { value: 'Reunião' },
                { value: 'Suporte' },
                { value: 'Feedback' },
                { value: 'Treinamento' },
                { value: 'Evento' },
            ],
        },
        {
            key: 'interaction.date',
            name: 'Data da interação',
            description: 'Data em que a interação ocorreu.',
            group: 'interaction',
            kind: 'date',
        },
        {
            key: 'interaction.summary',
            name: 'Resumo da interação',
            description: 'Resumo objetivo da interação.',
            group: 'interaction',
            kind: 'paragraph',
        },
        {
            key: 'interaction.insight',
            name: 'Insight coletado',
            description: 'Insights relevantes capturados na interação.',
            group: 'interaction',
            kind: 'paragraph',
        },
        {
            key: 'interaction.sentiment',
            name: 'Sentimento do cliente',
            description: 'Sentimento percebido do cliente nessa interação.',
            group: 'interaction',
            kind: 'select',
            options: [
                { value: 'Positivo' },
                { value: 'Neutro' },
                { value: 'Negativo' },
            ],
        },
        {
            key: 'interaction.nextSteps',
            name: 'Próximos passos',
            description: 'Ações acordadas após a interação.',
            group: 'interaction',
            kind: 'paragraph',
        },
        // ============================================================================
        // GRUPO 5: SUCCESS PLAN (6 campos) - Dados do Plano de Sucesso
        // ============================================================================
        {
            key: 'successPlan.goal',
            name: 'Objetivo da ação',
            description: 'Objetivo principal desta ação do plano de sucesso.',
            group: 'successPlan',
            kind: 'paragraph',
        },
        {
            key: 'successPlan.actionType',
            name: 'Tipo de ação',
            description: 'Tipo da ação de sucesso.',
            group: 'successPlan',
            kind: 'select',
            options: [
                { value: 'Adoção' },
                { value: 'Relacionamento' },
                { value: 'Expansão' },
            ],
        },
        {
            key: 'successPlan.priority',
            name: 'Prioridade',
            description: 'Prioridade da ação.',
            group: 'successPlan',
            kind: 'select',
            options: [
                { value: 'Baixa' },
                { value: 'Média' },
                { value: 'Alta' },
            ],
        },
        {
            key: 'successPlan.dueDate',
            name: 'Prazo',
            description: 'Prazo da ação.',
            group: 'successPlan',
            kind: 'date',
        },
        {
            key: 'successPlan.owner',
            name: 'Responsável da ação',
            description: 'Responsável pela execução da ação (idealmente um user picker; fallback documentado).',
            group: 'successPlan',
            kind: 'userPicker',
        },
        {
            key: 'successPlan.metric',
            name: 'Métrica de sucesso',
            description: 'Como o sucesso da ação será medido.',
            group: 'successPlan',
            kind: 'paragraph',
        },
        // ============================================================================
        // GRUPO 6: RISK / OPPORTUNITY (5 campos) - Dados de Risco/Oportunidade
        // ============================================================================
        {
            key: 'risk.type',
            name: 'Tipo de registro',
            description: 'Classificação do registro como risco, expansão ou indicação.',
            group: 'riskOpportunity',
            kind: 'select',
            options: [
                { value: 'Risco de churn' },
                { value: 'Expansão' },
                { value: 'Indicação' },
            ],
        },
        {
            key: 'risk.probability',
            name: 'Probabilidade',
            description: 'Probabilidade associada ao registro.',
            group: 'riskOpportunity',
            kind: 'select',
            options: [
                { value: 'Baixa' },
                { value: 'Média' },
                { value: 'Alta' },
            ],
        },
        {
            key: 'risk.estimatedValue',
            name: 'Valor estimado',
            description: 'Valor estimado associado a esta oportunidade ou risco.',
            group: 'riskOpportunity',
            kind: 'number',
        },
        {
            key: 'risk.reason',
            name: 'Motivo',
            description: 'Motivo do risco ou da oportunidade.',
            group: 'riskOpportunity',
            kind: 'paragraph',
        },
        {
            key: 'risk.actionPlan',
            name: 'Plano de ação',
            description: 'Plano de ação proposto.',
            group: 'riskOpportunity',
            kind: 'paragraph',
        },
    ];
    return { fields };
}
