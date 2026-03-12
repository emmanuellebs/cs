export type LogicalDashboardKey = 'health' | 'relationship' | 'growth';

export interface DashboardGadgetBlueprint {
  name: string;
  description?: string;
  /**
   * Nome do filtro JQL que o gadget deve usar.
   */
  filterName?: string;
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
      description: 'Visão geral da saúde da base de clientes.',
      gadgets: [
        {
          name: 'Clientes por health score',
          filterName: 'CSM - Contas por estágio do lifecycle',
          gadgetTypeHint: 'Gráfico de barras por faixas de Health Score',
        },
        {
          name: 'Clientes em risco',
          filterName: 'CSM - Clientes em risco',
          gadgetTypeHint: 'Issue statistics por Status da conta',
        },
        {
          name: 'Clientes com baixa atividade',
          filterName: 'CSM - Clientes sem interação recente',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Clientes sem contato há 60 dias',
          filterName: 'CSM - Clientes sem interação recente',
          gadgetTypeHint: 'Filter results',
        },
      ],
    },
    {
      key: 'relationship',
      name: 'CSM - Relacionamento',
      description: 'Indicadores de relacionamento e interações.',
      gadgets: [
        {
          name: 'Interações por mês',
          filterName: 'CSM - Interações do mês',
          gadgetTypeHint: 'Two dimensional filter statistics (por tipo de interação e mês)',
        },
        {
          name: 'Clientes sem reunião',
          filterName: 'CSM - Clientes sem interação recente',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Reuniões realizadas',
          filterName: 'CSM - Interações do mês',
          gadgetTypeHint: 'Filter statistics por Tipo de interação = Reunião',
        },
        {
          name: 'Participação em eventos',
          filterName: 'CSM - Interações do mês',
          gadgetTypeHint: 'Filter statistics por Tipo de interação = Evento',
        },
      ],
    },
    {
      key: 'growth',
      name: 'CSM - Crescimento',
      description: 'Foco em expansão, indicações e renovações.',
      gadgets: [
        {
          name: 'Expansões em andamento',
          filterName: 'CSM - Oportunidades em aberto',
          gadgetTypeHint: 'Filter results',
        },
        {
          name: 'Indicações recebidas',
          filterName: 'CSM - Oportunidades em aberto',
          gadgetTypeHint: 'Filter statistics por Tipo de registro = Indicação',
        },
        {
          name: 'Clientes potenciais para case',
          filterName: 'CSM - Contas ativas',
          gadgetTypeHint: 'Filter results com Health Score alto',
        },
        {
          name: 'Contratos renovados',
          filterName: 'CSM - Contas ativas',
          gadgetTypeHint: 'Filter statistics por Status da conta = Renovado',
        },
      ],
    },
  ];

  return { dashboards };
}

