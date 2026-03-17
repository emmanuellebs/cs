export type LogicalDashboardKey = 'health' | 'relationship' | 'growth';

export interface DashboardGadgetBlueprint {
  name: string;
  description?: string;
  /**
   * JQL explícito para o gadget. Será substituído {projectKey} em tempo de execução.
   */
  jqlTemplate?: string;
  /**
   * Tipo de gadget sugerido (para documentação manual).
   */
  gadgetTypeHint?: string;
}

export interface DashboardConfig {
  key: LogicalDashboardKey;
  name: string;
  description?: string;
  gadgets: DashboardGadgetBlueprint[];
}

export interface DashboardsProvisionConfig {
  dashboards: DashboardConfig[];
}

export function loadDashboardsProvisionConfig(): DashboardsProvisionConfig {
  const dashboards: DashboardConfig[] = [
    {
      key: 'health',
      name: 'CSM - Saúde da base',
      description:
        'Visão geral da saúde da base de clientes com indicadores de risco, atividade e scores de saúde.',
      gadgets: [
        {
          name: 'Clientes por health score',
          description: 'Distribuição de clientes por faixas de Health Score',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" ORDER BY "Health Score" DESC',
          gadgetTypeHint: 'Gadget de distribuição/estatísticas por Health Score',
        },
        {
          name: 'Clientes em risco',
          description: 'Clientes com ciclo da conta em estado de Risco',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND "Ciclo da Conta" = "Risco" ORDER BY updated DESC',
          gadgetTypeHint: 'Filter results ou Two dimensional statistics',
        },
        {
          name: 'Clientes com baixa atividade',
          description: 'Clientes com baixo engajamento de plataforma',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND "Engajamento da plataforma" = "Baixo" ORDER BY updated DESC',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Clientes sem contato há 60 dias',
          description: 'Clientes com última atualização >= 60 dias',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND updated <= -60d ORDER BY updated ASC',
          gadgetTypeHint: 'Filter results',
        },
      ],
    },
    {
      key: 'relationship',
      name: 'CSM - Relacionamento',
      description: 'Indicadores de qualidade do relacionamento através de interações e comunicação.',
      gadgets: [
        {
          name: 'Interações por mês',
          description: 'Volume de interações estratificado por tipo e período',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Interação" ORDER BY "Data da interação" DESC',
          gadgetTypeHint: 'Two dimensional filter statistics (por Tipo de interação)',
        },
        {
          name: 'Clientes sem reunião recente',
          description: 'Clientes sem interação do tipo Reunião nos últimos 30 dias',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND updated <= -30d AND NOT EXISTS(linkedIssue in (type = "Interação" AND "Tipo de interação" = "Reunião" AND updated >= -30d)) ORDER BY updated ASC',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Reuniões realizadas',
          description: 'Interações do tipo Reunião no período atual',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC',
          gadgetTypeHint: 'Filter statistics ou Issue statistics',
        },
        {
          name: 'Participação em eventos',
          description: 'Interações do tipo Evento registradas',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Interação" AND "Tipo de interação" = "Evento" ORDER BY "Data da interação" DESC',
          gadgetTypeHint: 'Issue statistics',
        },
      ],
    },
    {
      key: 'growth',
      name: 'CSM - Crescimento',
      description: 'Indicadores focados em expansão, oportunidades, indicações e renovações.',
      gadgets: [
        {
          name: 'Oportunidades em aberto',
          description: 'Oportunidades ainda em andamento e não concluídas',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Oportunidade" AND statusCategory != Done ORDER BY created DESC',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Indicações recebidas',
          description: 'Registros de oportunidades do tipo Indicação',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Oportunidade" AND "Tipo de registro" = "Indicação" ORDER BY created DESC',
          gadgetTypeHint: 'Issue statistics ou Filter results',
        },
        {
          name: 'Clientes potenciais para case',
          description: 'Clientes ativos com alto Health Score para case studies',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND "Ciclo da Conta" = "Ativo" AND "Health Score" >= 75 ORDER BY "Health Score" DESC',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Renovações próximas',
          description: 'Contratos com renovação prevista nos próximos 90 dias',
          jqlTemplate: 'project = {projectKey} AND issuetype = "Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("\\u002b90d") ORDER BY "Data de renovação" ASC',
          gadgetTypeHint: 'Filter results ou Two dimensional statistics',
        },
      ],
    },
  ];

  return { dashboards };
}

