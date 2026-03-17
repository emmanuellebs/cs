export interface BoardProvisionConfig {
  /**
   * Nome do board Kanban principal do CS.
   */
  name: string;
  /**
   * Descrição opcional do board.
   */
  description?: string;
  /**
   * Issue types que devem aparecer como cards no board.
   * Only Cliente deve aparecer no board. Demais tipos (Interação, Risco, etc.)
   * aparecem apenas como linked issues.
   */
  issueTypes: string[];
  /**
   * Colunas do board, representando o pipeline operacional de implementação e acompanhamento.
   */
  columns: {
    name: string;
  }[];
}

export interface BoardColumnConfig {
  name: string;
}

export function loadBoardProvisionConfig(): BoardProvisionConfig {
  return {
    name: 'WH - Customer Success',
    description:
      'Board Kanban - Pipeline operacional de CS com 8 etapas: Análise de Perfil → Implantação → Lançamento → Acompanhamento 1 → Acompanhamento 2 → Expansão → Renovação → Cancelamento. Mostra apenas issues do tipo Cliente. Interação, Risco, Oportunidade, Renovação e Plano de Sucesso são vinculados ao Cliente via linked issues.',
    issueTypes: ['Cliente'],
    columns: [
      { name: 'Análise de Perfil' },
      { name: 'Implantação' },
      { name: 'Lançamento' },
      { name: 'Acompanhamento 1' },
      { name: 'Acompanhamento 2' },
      { name: 'Expansão' },
      { name: 'Renovação' },
      { name: 'Cancelamento' },
    ],
  };
}

