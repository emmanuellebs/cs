# Mapeamento de campos customizados (CS)

Esta tabela relaciona cada campo lógico do provisionador com o campo real no Jira, incluindo status, tipo e opções para selects.

| Chave lógica | Nome | Grupo | Tipo | Status | Field ID | Opções (select) |
| ------------ | ---- | ----- | ---- | ------ | -------- | ---------------- |
| account.segment | Segmento | account | select | reused | customfield_12076 | Enterprise, Mid-Market, SMB |
| account.userCount | Quantidade de usuários | account | number | reused | customfield_12077 |  |
| account.city | Cidade | account | text | created | customfield_12113 |  |
| account.state | Estado (UF) | account | text | created | customfield_12114 |  |
| account.mrr | MRR | account | number | reused | customfield_12078 |  |
| account.recurringCadence | Recorrência de cobrança | account | select | created | customfield_12115 | Mensal, Trimestral, Anual |
| account.healthScore | Health Score | account | number | reused | customfield_12079 |  |
| account.nps | NPS | account | number | reused | customfield_12080 |  |
| account.engagement | Engajamento da plataforma | account | select | reused | customfield_12081 | Baixo, Médio, Alto |
| account.csParticipation | Participação CS | account | select | reused | customfield_12082 | Sim, Não |
| account.advocacyProgram | Participa do programa de Advocacy | account | select | reused | customfield_12083 | Sim, Não |
| account.renewalDate | Data de renovação | account | date | reused | customfield_12084 |  |
| account.product | Produto | account | select | reused | customfield_12085 | SaaS, Suporte |
| account.journeyStartDate | Data de início da jornada | account | date | reused | customfield_12086 |  |
| account.launchDate | Data do lançamento | account | date | reused | customfield_12087 |  |
| account.trainingDate | Data do treinamento | account | date | reused | customfield_12088 |  |
| account.contractDuration | Duração do contrato | account | text | reused | customfield_12089 |  |
| account.notes | Observações da conta | account | paragraph | reused | customfield_12090 |  |
| primaryContact.name | Nome do contato principal | primaryContact | text | reused | customfield_12091 |  |
| primaryContact.email | Email do contato principal | primaryContact | text | reused | customfield_12092 |  |
| primaryContact.phone | Telefone do contato principal | primaryContact | text | reused | customfield_12093 |  |
| primaryContact.role | Cargo do contato principal | primaryContact | text | reused | customfield_12094 |  |
| primaryContact.area | Área do contato principal | primaryContact | text | reused | customfield_12095 |  |
| csOperation.accountCycle | Ciclo da Conta | csOperation | select | reused | customfield_12096 | Onboarding, Ativo, Adoção, Engajamento, Expansão, Advocacy, Renovação, Renovado, Risco, Churn |
| csOperation.lastMeetingDate | Última reunião | csOperation | date | created | customfield_12116 |  |
| csOperation.lastInteractionDate | Última interação | csOperation | date | created | customfield_12117 |  |
| interaction.type | Tipo de interação | interaction | select | reused | customfield_12097 | Reunião, Suporte, Feedback, Treinamento, Evento |
| interaction.date | Data da interação | interaction | date | reused | customfield_12098 |  |
| interaction.summary | Resumo da interação | interaction | paragraph | reused | customfield_12099 |  |
| interaction.insight | Insight coletado | interaction | paragraph | reused | customfield_12100 |  |
| interaction.sentiment | Sentimento do cliente | interaction | select | reused | customfield_12101 | Positivo, Neutro, Negativo |
| interaction.nextSteps | Próximos passos | interaction | paragraph | reused | customfield_12102 |  |
| successPlan.goal | Objetivo da ação | successPlan | paragraph | created | customfield_12118 |  |
| successPlan.actionType | Tipo de ação | successPlan | select | created | customfield_12119 | Adoção, Relacionamento, Expansão |
| successPlan.priority | Prioridade | successPlan | select | reused | priority | Baixa, Média, Alta |
| successPlan.dueDate | Prazo | successPlan | date | created | customfield_12120 |  |
| successPlan.owner | Responsável da ação | successPlan | userPicker | created | customfield_12121 |  |
| successPlan.metric | Métrica de sucesso | successPlan | paragraph | created | customfield_12122 |  |
| risk.type | Tipo de registro | riskOpportunity | select | created | customfield_12123 | Risco de churn, Expansão, Indicação |
| risk.probability | Probabilidade | riskOpportunity | select | created | customfield_12124 | Baixa, Média, Alta |
| risk.estimatedValue | Valor estimado | riskOpportunity | number | created | customfield_12125 |  |
| risk.reason | Motivo | riskOpportunity | paragraph | created | customfield_12126 |  |
| risk.actionPlan | Plano de ação | riskOpportunity | paragraph | created | customfield_12127 |  |
