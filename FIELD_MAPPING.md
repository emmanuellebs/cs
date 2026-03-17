# Mapeamento de Campos - Jira CS

## Resumo Executivo

Total de **40 campos** organizados em **6 grupos funcionais**, distribuídos entre **6 issue types**.

```
Account (17)           ┐
Primary Contact (5)    │
CS Operation (1)       ├─ Associados ao issue type "Cliente"
Interaction (6)        │
Success Plan (6)       │
Risk/Opportunity (5)   ┘
```

## Tabela Consolidada por Issue Type

### Issue Type: CLIENTE (Conta Cliente)

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| account.segment | Segmento | Select | Account | Não | Enterprise/Mid-Market/SMB |
| account.userCount | Quantidade de usuários | Number | Account | Não | Usuários estimados |
| account.mrr | MRR | Number | Account | Não | Receita recorrente mensal |
| account.healthScore | Health Score | Number | Account | Não | Indicador 0-100 |
| account.nps | NPS | Number | Account | Não | Net Promoter Score |
| account.engagement | Engajamento da plataforma | Select | Account | Não | Baixo/Médio/Alto |
| account.csParticipation | Participação CS | Select | Account | Não | Sim/Não |
| account.advocacyProgram | Participa do programa de Advocacy | Select | Account | Não | Sim/Não |
| account.renewalDate | Data de renovação | Date | Account | Não | Data prevista |
| account.product | Produto | Select | Account | Não | Platform Core/Plus/Enterprise |
| account.journeyStartDate | Data de início da jornada | Date | Account | Não | Início no CS |
| account.launchDate | Data do lançamento | Date | Account | Não | Go-live |
| account.trainingDate | Data do treinamento | Date | Account | Não | Treinamento principal |
| account.contractDuration | Duração do contrato | Text | Account | Não | Em meses ou texto |
| account.notes | Observações da conta | Paragraph | Account | Não | Notas gerais |
| primaryContact.name | Nome do contato principal | Text | Primary Contact | Não | Nome do contato |
| primaryContact.email | Email do contato principal | Text | Primary Contact | Não | Email |
| primaryContact.phone | Telefone do contato principal | Text | Primary Contact | Não | Telefone |
| primaryContact.role | Cargo do contato principal | Text | Primary Contact | Não | Cargo/Função |
| primaryContact.area | Área do contato principal | Text | Primary Contact | Não | Departamento |
| csOperation.accountCycle | **Ciclo da Conta** | Select | CS Operation | Não | **Onboarding/Ativo/Adoção/Engajamento/Expansão/Advocacy/Renovação/Renovado/Risco/Churn** |

**Subtotal Cliente**: 21 campos

---

### Issue Type: INTERAÇÃO

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| interaction.type | Tipo de interação | Select | Interaction | Não | Reunião/Suporte/Feedback/Treinamento/Evento |
| interaction.date | Data da interação | Date | Interaction | Não | Quando ocorreu |
| interaction.summary | Resumo da interação | Paragraph | Interaction | Não | Resumo objetivo |
| interaction.insight | Insight coletado | Paragraph | Interaction | Não | Aprendizados |
| interaction.sentiment | Sentimento do cliente | Select | Interaction | Não | Positivo/Neutro/Negativo |
| interaction.nextSteps | Próximos passos | Paragraph | Interaction | Não | Ações acordadas |

**Subtotal Interação**: 6 campos

---

### Issue Type: PLANO DE SUCESSO

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| successPlan.goal | Objetivo da ação | Paragraph | Success Plan | Não | Objetivo principal |
| successPlan.actionType | Tipo de ação | Select | Success Plan | Não | Adoção/Relacionamento/Expansão |
| successPlan.priority | Prioridade | Select | Success Plan | Não | Baixa/Média/Alta |
| successPlan.dueDate | Prazo | Date | Success Plan | Não | Data limite |
| successPlan.owner | Responsável da ação | User Picker | Success Plan | Não | Dono da ação |
| successPlan.metric | Métrica de sucesso | Paragraph | Success Plan | Não | Como medir sucesso |

**Subtotal Plano de Sucesso**: 6 campos

---

### Issue Type: RISCO

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| risk.type | Tipo de registro | Select | Risk/Opportunity | Não | Risco de churn/Expansão/Indicação |
| risk.probability | Probabilidade | Select | Risk/Opportunity | Não | Baixa/Média/Alta |
| risk.estimatedValue | Valor estimado | Number | Risk/Opportunity | Não | Valor em jogo |
| risk.reason | Motivo | Paragraph | Risk/Opportunity | Não | Razão do risco |
| risk.actionPlan | Plano de ação | Paragraph | Risk/Opportunity | Não | Ações propostas |

**Subtotal Risco**: 5 campos

---

### Issue Type: OPORTUNIDADE

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| risk.type | Tipo de registro | Select | Risk/Opportunity | Não | Risco de churn/Expansão/Indicação |
| risk.probability | Probabilidade | Select | Risk/Opportunity | Não | Baixa/Média/Alta |
| risk.estimatedValue | Valor estimado | Number | Risk/Opportunity | Não | Valor em jogo |
| risk.reason | Motivo | Paragraph | Risk/Opportunity | Não | Razão da oportunidade |
| risk.actionPlan | Plano de ação | Paragraph | Risk/Opportunity | Não | Ações propostas |

**Subtotal Oportunidade**: 5 campos

---

### Issue Type: RENOVAÇÃO

| Campo (Chave) | Nome Exibido | Tipo | Grupo | Obrigatório | Descrição |
|---|---|---|---|---|---|
| risk.type | Tipo de registro | Select | Risk/Opportunity | Não | Risco de churn/Expansão/Indicação |
| risk.probability | Probabilidade | Select | Risk/Opportunity | Não | Baixa/Média/Alta |
| risk.estimatedValue | Valor estimado | Number | Risk/Opportunity | Não | Valor em jogo |
| risk.reason | Motivo | Paragraph | Risk/Opportunity | Não | Razão da renovação |
| risk.actionPlan | Plano de ação | Paragraph | Risk/Opportunity | Não | Ações propostas |

**Subtotal Renovação**: 5 campos

---

## Distribuição de Campos por Grupo Funcional

### Grupo 1: Account (17 campos)
Dados gerais da conta cliente:
- `account.segment` - Segmento (Select)
- `account.userCount` - Quantidade de usuários (Number)
- `account.mrr` - MRR (Number)
- `account.healthScore` - Health Score (Number)
- `account.nps` - NPS (Number)
- `account.engagement` - Engajamento da plataforma (Select)
- `account.csParticipation` - Participação CS (Select)
- `account.advocacyProgram` - Participa do programa de Advocacy (Select)
- `account.renewalDate` - Data de renovação (Date)
- `account.product` - Produto (Select)
- `account.journeyStartDate` - Data de início da jornada (Date)
- `account.launchDate` - Data do lançamento (Date)
- `account.trainingDate` - Data do treinamento (Date)
- `account.contractDuration` - Duração do contrato (Text)
- `account.notes` - Observações da conta (Paragraph)

**Total**: 15 campos

### Grupo 2: Primary Contact (5 campos)
Dados do contato principal do cliente:
- `primaryContact.name` - Nome do contato principal (Text)
- `primaryContact.email` - Email do contato principal (Text)
- `primaryContact.phone` - Telefone do contato principal (Text)
- `primaryContact.role` - Cargo do contato principal (Text)
- `primaryContact.area` - Área do contato principal (Text)

**Total**: 5 campos

### Grupo 3: CS Operation (1 campo estratégico)
**Apenas no issue type Cliente:**
- `csOperation.accountCycle` - **Ciclo da Conta** (Select, 10 valores)
  - Onboarding, Ativo, Adoção, Engajamento, Expansão
  - Advocacy, Renovação, Renovado, Risco, Churn

**Total**: 1 campo

### Grupo 4: Interaction (6 campos)
Dados específicos de interações com cliente:
- `interaction.type` - Tipo de interação (Select)
- `interaction.date` - Data da interação (Date)
- `interaction.summary` - Resumo da interação (Paragraph)
- `interaction.insight` - Insight coletado (Paragraph)
- `interaction.sentiment` - Sentimento do cliente (Select)
- `interaction.nextSteps` - Próximos passos (Paragraph)

**Total**: 6 campos

### Grupo 5: Success Plan (6 campos)
Dados do planejamento de sucesso:
- `successPlan.goal` - Objetivo da ação (Paragraph)
- `successPlan.actionType` - Tipo de ação (Select)
- `successPlan.priority` - Prioridade (Select)
- `successPlan.dueDate` - Prazo (Date)
- `successPlan.owner` - Responsável da ação (User Picker)
- `successPlan.metric` - Métrica de sucesso (Paragraph)

**Total**: 6 campos

### Grupo 6: Risk/Opportunity (5 campos)
Dados compartilhados entre Risco, Oportunidade e Renovação:
- `risk.type` - Tipo de registro (Select)
- `risk.probability` - Probabilidade (Select)
- `risk.estimatedValue` - Valor estimado (Number)
- `risk.reason` - Motivo (Paragraph)
- `risk.actionPlan` - Plano de ação (Paragraph)

**Total**: 5 campos

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de campos | 40 |
| Total de issue types | 6 |
| Campos em Cliente | 21 |
| Campos em Interação | 6 |
| Campos em Plano de Sucesso | 6 |
| Campos em Risco | 5 |
| Campos em Oportunidade | 5 |
| Campos em Renovação | 5 |
| Campos tipo Text | 8 |
| Campos tipo Select | 11 |
| Campos tipo Date | 5 |
| Campos tipo Number | 4 |
| Campos tipo Paragraph | 8 |
| Campos tipo User Picker | 1 |

---

## Tipos de Campo Utilizados

### Select (11 campos)
Campos com valores pré-definidos:
- Segmento (3 options)
- Engajamento (3 options)
- Participação CS (2 options)
- Advocacy (2 options)
- Produto (3 options)
- Tipo de Interação (5 options)
- Sentimento (3 options)
- Tipo de Ação (3 options)
- Prioridade (3 options)
- Tipo de Registro (3 options)
- Probabilidade (3 options)
- **Ciclo da Conta (10 options)** ⭐

### Date (5 campos)
- Data de renovação
- Data de início da jornada
- Data de lançamento
- Data do treinamento
- Data da interação
- Prazo

### Number (4 campos)
- Quantidade de usuários
- MRR
- Health Score
- NPS
- Valor estimado

### Text (8 campos)
- Duração do contrato
- Nome do contato principal
- Email do contato principal
- Telefone do contato principal
- Cargo do contato principal
- Área do contato principal

### Paragraph (8 campos)
- Observações da conta
- Resumo da interação
- Insight coletado
- Próximos passos
- Objetivo da ação
- Métrica de sucesso
- Motivo (risco/oportunidade)
- Plano de ação

### User Picker (1 campo)
- Responsável da ação

---

## Notas de Implementação

1. ✅ **Ciclo da Conta** é campo ÚNICO associado ao grupo `csOperation`, aparece APENAS em Cliente
2. ✅ Grupos de campos refletem funcionalidade, não issue type
3. ✅ Campos são reutilizados entre tipos (ex: Risk/Opportunity/Renovação compartilham mesmos campos)
4. ✅ User Picker em `successPlan.owner` requer validação de permissões
5. ✅ Todos os campos são opcionais por padrão
6. ✅ Total: ~40 campos estratégicos para suportar lifecycle CS completo
