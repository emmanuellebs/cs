# Arquitetura do Projeto Jira CS - WH Customer Success

## Visão Geral

O projeto **CSM** (Customer Success Management) no Jira Cloud implementa um sistema completo de gestão de lifecycle de clientes, estruturado em **4 camadas arquiteturais**:

```
┌────────────────────────────────────────────────────────────────┐
│ CAMADA D: DASHBOARDS (Análise & Reportagem)                   │
│ ├─ Saúde da Base (4 gadgets: health scores, riscos, atividade)│
│ ├─ Relacionamento (4 gadgets: interações, reuniões, eventos)  │
│ └─ Crescimento (4 gadgets: oportunidades, renovações)         │
├────────────────────────────────────────────────────────────────┤
│ CAMADA C: CICLO DA CONTA (Estado Estratégico)                 │
│ └─ Campo "Ciclo da Conta" (10 valores) - APENAS em Cliente   │
│    ├─ Onboarding, Ativo, Adoção, Engajamento, Expansão       │
│    ├─ Advocacy, Renovação, Renovado, Risco, Churn            │
├────────────────────────────────────────────────────────────────┤
│ CAMADA B: BOARD OPERACIONAL (Pipeline de Execução)           │
│ ├─ 8 Colunas (Kanban): Análise → Implantação → ... → Cancel. │
│ ├─ Mostra APENAS issues do tipo Cliente                       │
│ └─ Outras types aparecem como LINKED ISSUES do Cliente       │
├────────────────────────────────────────────────────────────────┤
│ CAMADA A: ENTIDADES (Issue Types - 6 Tipos)                   │
│ ├─ Cliente (Conta)        ← Central, coordena tudo           │
│ ├─ Interação             ← Linked to Cliente                  │
│ ├─ Plano de Sucesso      ← Linked to Cliente                  │
│ ├─ Risco                 ← Linked to Cliente                  │
│ ├─ Oportunidade          ← Linked to Cliente                  │
│ └─ Renovação             ← Linked to Cliente                  │
└────────────────────────────────────────────────────────────────┘
```

## Camada A: Entidades (Issue Types)

### 1. Cliente (Conta Cliente)
- **Descrição**: Representa a conta do cliente no pipeline CS
- **Campos principais**: 
  - Segmento (Enterprise/Mid-Market/SMB)
  - MRR, Health Score, NPS
  - Data de renovação, Produto
  - Engagement, Participação CS
  - **Ciclo da Conta** (campo estratégico)
- **Linkedado via**: Interação, Plano de Sucesso, Risco, Oportunidade, Renovação
- **Aparece no board**: ✅ SIM (visível como cards)

### 2. Interação
- **Descrição**: Registra contatos/comunicações com o cliente
- **Campos principais**: Tipo (Reunião/Suporte/Feedback/Treinamento/Evento), Data, Resumo, Sentimento, Próximos Passos
- **Linkedado a**: Cliente
- **Aparece no board**: ❌ NÃO (apenas como linked issue do Cliente)

### 3. Plano de Sucesso
- **Descrição**: Ações planejadas para atingir objetivos com o cliente
- **Campos principais**: Objetivo, Tipo de ação (Adoção/Relacionamento/Expansão), Prioridade, Prazo, Responsável, Métrica
- **Linkedado a**: Cliente
- **Aparece no board**: ❌ NÃO (apenas como linked issue do Cliente)

### 4. Risco
- **Descrição**: Identifica riscos de churn ou problemas potenciais
- **Campos principais**: Tipo (Risco de churn/Expansão/Indicação), Probabilidade, Valor estimado, Motivo, Plano de ação
- **Linkedado a**: Cliente
- **Aparece no board**: ❌ NÃO (apenas como linked issue do Cliente)

### 5. Oportunidade
- **Descrição**: Identifica oportunidades de expansão ou indicações
- **Campos principais**: Tipo (Risco de churn/Expansão/Indicação), Probabilidade, Valor estimado, Motivo, Plano de ação
- **Linkedado a**: Cliente
- **Aparece no board**: ❌ NÃO (apenas como linked issue do Cliente)

### 6. Renovação
- **Descrição**: Rastreia processo de renovação contratual
- **Campos principais**: Relacionados a ciclo de renovação e próximas ações
- **Linkedado a**: Cliente
- **Aparece no board**: ❌ NÃO (apenas como linked issue do Cliente)

## Camada B: Board Operacional

### Board Kanban: "WH - Customer Success"

**Configuração**:
- **Tipo**: Kanban
- **Issue Types**: `["Cliente"]` (apenas Cliente aparece como card)
- **Total de Colunas**: 8

**Colunas (Pipeline de Implementação)**:
1. **Análise de Perfil** - Cliente novo, gathering requirements
2. **Implantação** - Implementation em andamento
3. **Lançamento** - Solution go-live
4. **Acompanhamento 1** - First post-launch touchpoint
5. **Acompanhamento 2** - Second post-launch evaluation
6. **Expansão** - Oportunidades de expansão
7. **Renovação** - Processo de renovação contratual
8. **Cancelamento** - Cliente finalizado/churnado

**Visualização de Relacionamentos**:
- Cada card de Cliente mostra suas linked issues (Interação, Risco, Oportunidade, etc.)
- Permite visão rápida do contexto completo do cliente

## Camada C: Ciclo da Conta (Estado Estratégico)

### Campo: "Ciclo da Conta"

**Localização**: Apenas em issues do tipo `Cliente`

**Propósito**: Representar o estado estratégico na jornada de CS, complementar ao board operacional

**10 Valores Possíveis**:

| Estado | Descrição | Típico Board Stage |
|--------|-----------|-------------------|
| **Onboarding** | Fase inicial, implementação ativa | Análise → Lançamento |
| **Ativo** | Cliente em uso normal | Acompanhamento 1/2 |
| **Adoção** | Crescimento de utilização | Acompanhamento 1/2 |
| **Engajamento** | Alta participação e satisfação | Acompanhamento 2 → Expansão |
| **Expansão** | Oportunidades de crescimento | Expansão |
| **Advocacy** | Cliente promotor, case study | Expansão → Renovação |
| **Renovação** | Contrato próximo de vencer | Renovação |
| **Renovado** | Contrato recém renovado | Renovação → Acompanhamento |
| **Risco** | Possível churn, problema crítico | Qualquer → Cancelamento |
| **Churn** | Cliente perdido/inativo | Cancelamento |

**Diferença do Board**:
- **Board**: Representam o **processo operacional** (o que se faz com o cliente)
- **Ciclo da Conta**: Representa o **estado estratégico** (como o cliente está)

## Camada D: Dashboards

### Dashboard 1: "CSM - Saúde da Base"

Oferece visão consolidada da saúde da carteira de clientes.

**Gadgets** (4):
1. **Clientes por Health Score**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" ORDER BY "Health Score" DESC`
   - Tipo sugerido: Two dimensional statistics
   
2. **Clientes em Risco**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Risco"`
   - Tipo sugerido: Filter results
   
3. **Clientes com Baixa Atividade**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Engajamento da plataforma" = "Baixo"`
   - Tipo sugerido: Filter results
   
4. **Clientes Sem Contato há 60 Dias**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d`
   - Tipo sugerido: Filter results

### Dashboard 2: "CSM - Relacionamento"

Indicadores de qualidade do relacionamento através de interações.

**Gadgets** (4):
1. **Interações por Tipo**
   - JQL: `project = CSM AND issuetype = "Interação" ORDER BY "Data da interação" DESC`
   - Tipo sugerido: Two dimensional statistics
   
2. **Clientes Sem Reunião Recente**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND updated <= -30d`
   - Tipo sugerido: Filter results
   
3. **Reuniões Realizadas (Mês)**
   - JQL: `project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND "Data da interação" >= startOfMonth()`
   - Tipo sugerido: Issue statistics
   
4. **Participação em Eventos**
   - JQL: `project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Evento"`
   - Tipo sugerido: Issue statistics

### Dashboard 3: "CSM - Crescimento"

Foco em expansão, oportunidades, indicações e renovações.

**Gadgets** (4):
1. **Oportunidades em Aberto**
   - JQL: `project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done`
   - Tipo sugerido: Filter results
   
2. **Indicações Recebidas**
   - JQL: `project = CSM AND issuetype = "Oportunidade" AND "Tipo de registro" = "Indicação"`
   - Tipo sugerido: Issue statistics
   
3. **Clientes Potenciais para Case**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo" AND "Health Score" >= 75`
   - Tipo sugerido: Filter results
   
4. **Renovações Próximas (90 dias)**
   - JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("\u002b90d")`
   - Tipo sugerido: Two dimensional statistics

## Campos por Grupo Funcional

### Grupo 1: Account (17 campos)
Dados da conta cliente:
- Segmento, Quantidade de usuários, MRR, Health Score, NPS
- Engajamento da plataforma, Participação CS, Participa de Advocacy
- Data de renovação, Produto
- Data de início da jornada, Data de lançamento, Data de treinamento
- Duração do contrato, Observações da conta

### Grupo 2: Primary Contact (5 campos)
Dados do contato principal:
- Nome, Email, Telefone, Cargo, Área

### Grupo 3: CS Operation (1 campo estratégico)
- **Ciclo da Conta** (10 valores) - APENAS em Cliente

### Grupo 4: Interaction (6 campos)
Dados de interações:
- Tipo, Data, Resumo, Insight, Sentimento, Próximos passos

### Grupo 5: Success Plan (6 campos)
Dados do plano de sucesso:
- Objetivo, Tipo de ação, Prioridade, Prazo, Responsável, Métrica

### Grupo 6: Risk/Opportunity (5 campos)
Dados de risco/oportunidade:
- Tipo, Probabilidade, Valor estimado, Motivo, Plano de ação

**Total**: ~40 campos organizados por funcionalidade

## Relacionamentos (Linked Issues)

Todas as relações seguem o padrão "relates to":

```
Cliente (origem) ← relates to → Interação (destino)
Cliente (origem) ← relates to → Plano de Sucesso (destino)
Cliente (origem) ← relates to → Risco (destino)
Cliente (origem) ← relates to → Oportunidade (destino)
Cliente (origem) ← relates to → Renovação (destino)
```

**Importante**: Não usar subtasks. Linked issues permitem:
- Visão clara de dependências
- Flexibilidade nas relações
- Melhor suporte ao Jira Agile

## Fluxo de Dados

1. **Entrada**: Cliente cria nova conta (issue tipo Cliente)
2. **Operação**: Cliente flui pelo board operacional (8 colunas)
3. **Estratégia**: Ciclo da Conta é atualizado conforme progresso
4. **Relacionamento**: Interações, Planos, Riscos linkedados ao Cliente
5. **Análise**: Dashboards agregam dados e mostram health, relacionamento, crescimento

## Notas de Implementação

- ✅ Board mostra APENAS Cliente
- ✅ Interação/Risco/etc. aparecem como linked issues (não cards no board)
- ✅ "Ciclo da Conta" é campo ÚNICO no grupo csOperation (não no account)
- ✅ 3 dashboards com JQL explícito por gadget
- ✅ Filtros pré-configurados com JQL
- ✅ 6 issue types, todas com campos apropriados
