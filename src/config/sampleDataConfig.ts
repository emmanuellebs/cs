/**
 * Configuração de dados demonstrativos (Sample Data)
 * 
 * Define um Cliente exemplo completo com todas as issues relacionadas.
 * Esses dados são opcionais e criados apenas se CREATE_SAMPLE_DATA=true.
 */

export interface SampleAccountData {
  summary: string;
  description: string;
  segment: string;
  numberOfUsers: number;
  mrr: number;
  healthScore: number;
  nps: number;
  recurringCadence: string;
  engagement: string;
  csParticipation: string;
  advocacyProgram: string;
  accountCycle: string;
  renewalDate: string; // ISO 8601: YYYY-MM-DD
  product: string;
  city: string;
  state: string;
  journeyStartDate: string;
  launchDate: string;
  trainingDate: string;
  contractDuration: string;
  mainContactName: string;
  mainContactEmail: string;
  mainContactPhone: string;
  mainContactPosition: string;
  mainContactArea: string;
  accountNotes: string;
}

export interface SampleInteractionData {
  summary: string;
  description: string;
  interactionType: string;
  interactionDate: string;
  interactionSummary: string;
  sentiment: string;
  collectedInsight: string;
  nextSteps: string;
}

export interface SampleSuccessPlanData {
  summary: string;
  description: string;
  actionObjective: string;
  successMetrics: string;
  dueDate: string;
  priority: string;
}

export interface SampleRiskData {
  summary: string;
  description: string;
  recordType: string;
  probability: string;
  motive: string;
  actionPlan: string;
}

export interface SampleOpportunityData {
  summary: string;
  description: string;
  recordType: string;
  estimatedValue: number;
  probability: string;
  nextSteps: string;
}

export interface SampleRenewalData {
  summary: string;
  description: string;
  probability: string;
  nextSteps: string;
}

export function getSampleData(): {
  account: SampleAccountData;
  interaction: SampleInteractionData;
  successPlan: SampleSuccessPlanData;
  risk: SampleRiskData;
  opportunity: SampleOpportunityData;
  renewal: SampleRenewalData;
} {
  const today = new Date();
  const renewalDate = new Date(today.getTime() + 280 * 24 * 60 * 60 * 1000); // 280 dias
  const planDueDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 dias
  const journeyStartDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
  const launchDate = new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000);
  const trainingDate = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

  return {
    account: {
      summary: 'Cliente Exemplo - Empresa Alfa',
      description:
        'Cliente demonstrativo criado automaticamente pelo provisionador de CS. ' +
        'Use este cliente como referência para entender a estrutura de dados. ' +
        'Pode ser deletado em segurança após aprender o fluxo.',
      segment: 'Mid-Market',
      numberOfUsers: 150,
      mrr: 8000,
      healthScore: 75,
      nps: 45,
      recurringCadence: 'Mensal',
      engagement: 'Alto',
      csParticipation: 'Sim',
      advocacyProgram: 'Não',
      accountCycle: 'Engajamento',
      renewalDate: renewalDate.toISOString().split('T')[0],
      product: 'SaaS',
      city: 'São Paulo',
      state: 'SP',
      journeyStartDate: journeyStartDate.toISOString().split('T')[0],
      launchDate: launchDate.toISOString().split('T')[0],
      trainingDate: trainingDate.toISOString().split('T')[0],
      contractDuration: '12 meses',
      mainContactName: 'João Silva',
      mainContactEmail: 'joao@empresa-alfa.com.br',
      mainContactPhone: '+55 11 99999-0000',
      mainContactPosition: 'CEO',
      mainContactArea: 'Executiva',
      accountNotes:
        'Cliente em fase de evolução. Adoção do sistema ocorreu com sucesso. ' +
        'Desafio atual: baixa utilização do módulo Analytics. ' +
        'Oportunidade identificada para expansão de licenças e treinamento.',
    },

    interaction: {
      summary: 'Reunião de Acompanhamento - Março 2026',
      description:
        'Reunião periódica de acompanhamento com cliente para avaliar progresso, ' +
        'identificar desafios e planejar próximos passos.',
      interactionType: 'Reunião',
      interactionDate: today.toISOString().split('T')[0],
      interactionSummary:
        'Cliente relatou excelente evolução na adoção da Plataforma Core. ' +
        'Core: 95% de utilização por todos os usuários. ' +
        'Analytics: Apenas 20% de utilização - necessário maior acompanhamento e treinamento. ' +
        'Cliente muito satisfeito com suporte recebido. ' +
        'Próxima reunião em 30 dias.',
      sentiment: 'Positivo',
      collectedInsight:
        'Equipe do cliente precisa de treinamento específico no Analytics. ' +
        'Há interesse em expandir para outros módulos após melhorar adoção atual. ' +
        'Conta será renovada conforme previsto.',
      nextSteps:
        '1. Agendar sessão de treinamento do Analytics para próx. 2 semanas\n' +
        '2. Preparar agenda de apresentação de novos módulos\n' +
        '3. Enviar estudos de caso de clientes similares',
    },

    successPlan: {
      summary: 'Plano de Sucesso - Aumentar Adoção do Analytics',
      description:
        'Plano estruturado para aumentar a utilização do módulo Analytics ' +
        'de 20% para 80% em 90 dias.',
      actionObjective:
        'Objetivo: Alcançar 80% de utilização semanal do Analytics em 90 dias.\n' +
        'Ações:\n' +
        '1. Treinamento de 2 horas em recursos do Analytics (Semana 1)\n' +
        '2. Acompanhamento semanal com o usuário-chave (Semanas 1-4)\n' +
        '3. Customização de 3 relatórios estratégicos (Semana 3)\n' +
        '4. Reunião de revisão de valor (Semana 8)',
      successMetrics:
        'Métrica de Sucesso: Número de relatórios gerados por semana.\n' +
        'Meta: 15 ou mais relatórios por semana.\n' +
        'KPI Secundário: Dias ativos de utilização (meta: 5+ dias por semana).',
      dueDate: planDueDate.toISOString().split('T')[0],
      priority: 'Alta',
    },

    risk: {
      summary: 'Risco: Baixa Adoção do Módulo Analytics',
      description:
        'Risco identificado durante reunião de acompanhamento. ' +
        'Baixa adoção do Analytics pode levar a menor valor percebido e risco de churn.',
      recordType: 'Risco de Negócio',
      probability: 'Alta',
      motive:
        'Razão: Falta de conhecimento técnico da equipe no módulo Analytics.\n' +
        'Impacto Potencial: Redução de MRR futuro, possível churn na renovação.\n' +
        'Urgência: Alta - renovação em 9 meses.',
      actionPlan:
        'Plano de Mitigação:\n' +
        '1. Sessão de treinamento agendada para 15 dias\n' +
        '2. Nomeação de analista-chave do cliente como CSM dedicado\n' +
        '3. Suporte técnico prioritário nas primeiras 4 semanas\n' +
        '4. Revisão em 30 dias - se não atingir 50%, escalar para gerência',
    },

    opportunity: {
      summary: 'Oportunidade: Expansão para Módulo Integrações',
      description:
        'Oportunidade de expansão identificada durante acompanhamento. ' +
        'Cliente tem necessidade e capacidade de absorver Módulo de Integrações.',
      recordType: 'Expansão de Produto',
      estimatedValue: 3000,
      probability: 'Média',
      nextSteps:
        '1. Demonstração do módulo de Integrações (2 semanas)\n' +
        '2. Proposta comercial após validação de Analytics (Semana 4)\n' +
        '3. PoC / Piloto se aprovado (2-4 semanas)\n' +
        '4. Implementação e treinamento',
    },

    renewal: {
      summary: 'Renovação - Empresa Alfa 2026',
      description:
        'Processo de renovação contratual para Cliente Exemplo - Empresa Alfa.\n' +
        'Data: ' +
        renewalDate.toISOString().split('T')[0] +
        '\n' +
        'Valor atual: R$ 96.000 (anual)',
      probability: 'Alta',
      nextSteps:
        '1. Revisão de saúde da conta e value delivered (Agosto 2026)\n' +
        '2. Discussão de melhorias para próx. período (Setembro 2026)\n' +
        '3. Proposta comercial (Outubro 2026)\n' +
        '4. Negociação e assinatura (Novembro 2026)\n' +
        '5. Documentação pós-renovação (Dezembro 2026)',
    },
  };
}
