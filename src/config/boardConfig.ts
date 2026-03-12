export interface BoardProvisionConfig {
  /**
   * Nome do board Kanban principal do CS.
   */
  name: string;
  /**
   * Descrição opcional do board.
   */
  description?: string;
}

export function loadBoardProvisionConfig(): BoardProvisionConfig {
  return {
    name: 'CSM - Lifecycle Kanban',
    description: 'Board Kanban para lifecycle de Customer Success (Onboarding → Renovado, Risco, Churn).',
  };
}

