# Mapeamento de campos customizados (CS)

Esta tabela relaciona cada campo lógico do provisionador com o campo real no Jira, incluindo status, tipo e opções para selects.

| Chave lógica | Nome | Grupo | Tipo | Status | Field ID | Opções (select) |
| ------------ | ---- | ----- | ---- | ------ | -------- | ---------------- |
| account.segment | Segmento | account | select | skipped |  | Enterprise, Mid-Market, SMB |
| account.userCount | Quantidade de usuários | account | number | skipped |  |  |
| account.mrr | MRR | account | number | skipped |  |  |
| account.healthScore | Health Score | account | number | skipped |  |  |
| account.nps | NPS | account | number | skipped |  |  |
| account.status | Status da conta | account | select | skipped |  | Onboarding, Ativo, Engajamento, Expansão, Advocacy, Renovação, Renovado, Risco, Churn |
| account.engagement | Engajamento da plataforma | account | select | skipped |  | Baixo, Médio, Alto |
| account.csParticipation | Participação CS | account | select | skipped |  | Sim, Não |
| account.advocacyProgram | Participa do programa de Advocacy | account | select | skipped |  | Sim, Não |
| account.renewalDate | Data de renovação | account | date | skipped |  |  |
| account.product | Produto | account | select | skipped |  | Platform Core, Platform Plus, Platform Enterprise |
| account.journeyStartDate | Data de início da jornada | account | date | skipped |  |  |
| account.launchDate | Data do lançamento | account | date | skipped |  |  |
| account.trainingDate | Data do treinamento | account | date | skipped |  |  |
| account.contractDuration | Duração do contrato | account | text | skipped |  |  |
| account.notes | Observações da conta | account | paragraph | skipped |  |  |
| primaryContact.name | Nome do contato principal | primaryContact | text | skipped |  |  |
| primaryContact.email | Email do contato principal | primaryContact | text | skipped |  |  |
| primaryContact.phone | Telefone do contato principal | primaryContact | text | skipped |  |  |
| primaryContact.role | Cargo do contato principal | primaryContact | text | skipped |  |  |
| primaryContact.area | Área do contato principal | primaryContact | text | skipped |  |  |
| interaction.type | Tipo de interação | interaction | select | skipped |  | Reunião, Suporte, Feedback, Treinamento, Evento |
| interaction.date | Data da interação | interaction | date | skipped |  |  |
| interaction.summary | Resumo da interação | interaction | paragraph | skipped |  |  |
| interaction.insight | Insight coletado | interaction | paragraph | skipped |  |  |
| interaction.sentiment | Sentimento do cliente | interaction | select | skipped |  | Positivo, Neutro, Negativo |
| interaction.nextSteps | Próximos passos | interaction | paragraph | skipped |  |  |
| successPlan.goal | Objetivo da ação | successPlan | paragraph | skipped |  |  |
| successPlan.actionType | Tipo de ação | successPlan | select | skipped |  | Adoção, Relacionamento, Expansão |
| successPlan.priority | Prioridade | successPlan | select | reused | priority | Baixa, Média, Alta |
| successPlan.dueDate | Prazo | successPlan | date | skipped |  |  |
| successPlan.owner | Responsável da ação | successPlan | userPicker | skipped |  |  |
| successPlan.metric | Métrica de sucesso | successPlan | paragraph | skipped |  |  |
| risk.type | Tipo de registro | riskOpportunity | select | skipped |  | Risco de churn, Expansão, Indicação |
| risk.probability | Probabilidade | riskOpportunity | select | skipped |  | Baixa, Média, Alta |
| risk.estimatedValue | Valor estimado | riskOpportunity | number | skipped |  |  |
| risk.reason | Motivo | riskOpportunity | paragraph | skipped |  |  |
| risk.actionPlan | Plano de ação | riskOpportunity | paragraph | skipped |  |  |
