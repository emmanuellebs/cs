export type FieldLogicalGroup =
  | 'account'
  | 'primaryContact'
  | 'interaction'
  | 'successPlan'
  | 'riskOpportunity'
  | 'lifecycle';

export type FieldKind =
  | 'text'
  | 'paragraph'
  | 'number'
  | 'date'
  | 'select'
  | 'userPicker';

export interface SelectOptionConfig {
  value: string;
}

export interface FieldConfig {
  /**
   * Chave interna estável para referência em mapeamentos.
   */
  key: string;
  /**
   * Nome do campo a ser criado no Jira.
   */
  name: string;
  description?: string;
  group: FieldLogicalGroup;
  kind: FieldKind;
  /**
   * Lista de opções para campos select.
   */
  options?: SelectOptionConfig[];
}

export interface FieldsProvisionConfig {
  fields: FieldConfig[];
}

export function loadFieldsProvisionConfig(): FieldsProvisionConfig {
  const fields: FieldConfig[] = [
    // Conta Cliente
    {
      key: 'account.segment',
      name: 'Segmento',
      description: 'Segmento da conta cliente.',
      group: 'account',
      kind: 'select',
    },
    {
      key: 'account.userCount',
      name: 'Quantidade de usuários',
      description: 'Quantidade estimada de usuários na conta.',
      group: 'account',
      kind: 'number',
    },
    {
      key: 'account.mrr',
      name: 'MRR',
      description: 'Receita recorrente mensal associada à conta.',
      group: 'account',
      kind: 'number',
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
      key: 'account.status',
      name: 'Status da conta',
      description: 'Status consolidado da conta na visão de CS.',
      group: 'account',
      kind: 'select',
      options: [
        { value: 'Onboarding' },
        { value: 'Ativo' },
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

    // Contato principal
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

    // Interação
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

    // Plano de Sucesso
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
      description:
        'Responsável pela execução da ação (idealmente um user picker; fallback documentado).',
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

    // Risco / Oportunidade
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

