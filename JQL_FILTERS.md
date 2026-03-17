# Filtros JQL - Jira CS

## Visão Geral

Total de **9 filtros** pré-configurados para relatórios, dashboards e consultas operacionais.

| Chave | Nome | Descrição | Tipo |
|-------|------|-----------|------|
| boardBase | CSM - Board base | Filtro de base do board Kanban | Operacional |
| clientsAtRisk | CSM - Clientes em risco | Clientes com risco de churn | Analítico |
| upcomingRenewals | CSM - Renovações próximas | Renovações nos próximos 90 dias | Analítico |
| noRecentInteractions | CSM - Clientes sem interação recente | Sem updates há 60 dias | Analítico |
| openOpportunities | CSM - Oportunidades em aberto | Oportunidades não concluídas | Analítico |
| accountsByLifecycle | CSM - Contas por estágio do lifecycle | Todas as contas (visão por ciclo) | Analítico |
| activeAccounts | CSM - Contas ativas | Contas em ciclo Ativo | Analítico |
| churnedAccounts | CSM - Contas churnadas | Contas em ciclo Churn | Analítico |
| interactionsThisMonth | CSM - Interações do mês | Interações do mês atual | Analítico |

---

## Filtros Detalhados

### 1. BOARD BASE (Operacional)

**Chave**: `boardBase`

**Nome**: CSM - Board base

**Descrição**: Filtro base para o board Kanban de lifecycle

**JQL**:
```jql
project = {projectKey} ORDER BY updated DESC
```

**Propósito**: Alimenta o board Kanban, mostrando todas as issues do projeto

**Nota**: `{projectKey}` é substituído por `CSM` em tempo de execução

---

### 2. CLIENTES EM RISCO (Analítico)

**Chave**: `clientsAtRisk`

**Nome**: CSM - Clientes em risco

**Descrição**: Clientes com risco de churn identificado

**JQL**:
```jql
project = CSM AND "Ciclo da Conta" = "Risco" ORDER BY updated DESC
```

**Propósito**: Alertar sobre contas em risco que requerem ação imediata

**Uso em Dashboard**: "Saúde da Base" - widget de clientes em risco

---

### 3. RENOVAÇÕES PRÓXIMAS (Analítico)

**Chave**: `upcomingRenewals`

**Nome**: CSM - Renovações próximas

**Descrição**: Contas com renovação próxima

**JQL**:
```jql
project = CSM AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d") ORDER BY "Data de renovação" ASC
```

**Propósito**: Identificar renovações nos próximos 90 dias para planejamento

**Uso em Dashboard**: "Crescimento" - widget de renovações próximas

**Nota**: Intervalo fixo de 90 dias

---

### 4. CLIENTES SEM INTERAÇÃO RECENTE (Analítico)

**Chave**: `noRecentInteractions`

**Nome**: CSM - Clientes sem interação recente

**Descrição**: Clientes sem interações nos últimos 60 dias

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d ORDER BY updated ASC
```

**Propósito**: Identificar contas dormentes que precisam reengajamento

**Uso em Dashboard**: "Saúde da Base" - widget de clientes sem contato recente

**Nota**: 60 dias de inatividade

---

### 5. OPORTUNIDADES EM ABERTO (Analítico)

**Chave**: `openOpportunities`

**Nome**: CSM - Oportunidades em aberto

**Descrição**: Oportunidades CS ainda em andamento

**JQL**:
```jql
project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done ORDER BY created DESC
```

**Propósito**: Rastrear pipeline de oportunidades

**Uso em Dashboard**: "Crescimento" - widget de oportunidades em aberto

**Status Filter**: Exclui issues em qualquer status de "Done"

---

### 6. CONTAS POR ESTÁGIO DO LIFECYCLE (Analítico)

**Chave**: `accountsByLifecycle`

**Nome**: CSM - Contas por estágio do lifecycle

**Descrição**: Visão geral por estágio de lifecycle

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente"
```

**Propósito**: Base para análises por "Ciclo da Conta"

**Uso**: Filtro genérico para todas as contas (pode ser agrupado por Ciclo)

---

### 7. CONTAS ATIVAS (Analítico)

**Chave**: `activeAccounts`

**Nome**: CSM - Contas ativas

**Descrição**: Contas em estágio de cliente ativo

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo"
```

**Propósito**: Focar em clientes operacionais/pagantes

**Uso em Dashboard**: "Crescimento" - widget de clientes potenciais para case studies

---

### 8. CONTAS CHURNADAS (Analítico)

**Chave**: `churnedAccounts`

**Nome**: CSM - Contas churnadas

**Descrição**: Contas marcadas como churn

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Churn"
```

**Propósito**: Análise pós-mortem e prevenção de futuros churns

**Uso**: Relatórios de churn, análise de padrões

---

### 9. INTERAÇÕES DO MÊS (Analítico)

**Chave**: `interactionsThisMonth`

**Nome**: CSM - Interações do mês

**Descrição**: Interações registradas no mês atual

**JQL**:
```jql
project = CSM AND issuetype = "Interação" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC
```

**Propósito**: Rastrear atividade de interação mensal

**Uso em Dashboard**: "Relacionamento" - múltiplos widgets sobre interações

**Data Filter**: `startOfMonth()` - início do mês Gregoriano atual

---

## Grupos de Filtros

### Grupo 1: Operacional (1 filtro)
- `boardBase` - Alimenta o board Kanban

### Grupo 2: Saúde da Base (3 filtros)
- `clientsAtRisk` - Clientes em risco
- `noRecentInteractions` - Clientes sem contato
- `activeAccounts` - Clientes ativos (potencial)

### Grupo 3: Relacionamento (1 filtro)
- `interactionsThisMonth` - Interações do período

### Grupo 4: Crescimento (4 filtros)
- `upcomingRenewals` - Renovações próximas
- `openOpportunities` - Oportunidades abertas
- `activeAccounts` - Base para potenciais cases
- `churnedAccounts` - Análise de perdidos

---

## Padrões de Sintaxe JQL

### Funções de Data

| Função | Exemplo | Descrição |
|--------|---------|-----------|
| `startOfDay()` | `updated >= startOfDay()` | Início do dia atual |
| `endOfDay()` | `updated <= endOfDay("+90d")` | Fim do dia em +90 dias |
| `startOfMonth()` | `"Data da interação" >= startOfMonth()` | Início do mês Gregoriano |
| `-60d` | `updated <= -60d` | 60 dias atrás |
| `-30d` | `updated <= -30d` | 30 dias atrás |

### Operadores

| Operador | Exemplo | Descrição |
|----------|---------|-----------|
| `=` | `"Ciclo da Conta" = "Risco"` | Igualdade |
| `!=` | `statusCategory != Done` | Diferença |
| `>=` / `<=` | `"Data de renovação" >= startOfDay()` | Comparação de datas |
| `AND` | `project = CSM AND issuetype = "Conta Cliente"` | Condição lógica |
| `ORDER BY` | `ORDER BY updated DESC` | Ordenação |

### Escape de Caracteres

Campos com espaços ou caracteres especiais devem estar entre aspas:
```jql
"Ciclo da Conta" = "Risco"
"Data de renovação" >= startOfDay()
```

---

## Integração com Dashboards

### Dashboard "Saúde da Base"
- Gadget 1: Usa `accountsByLifecycle` (agrupado por Health Score)
- Gadget 2: Usa `clientsAtRisk`
- Gadget 3: Usa `noRecentInteractions` + filtro de "Engajamento da plataforma" = Baixo
- Gadget 4: Usa `noRecentInteractions`

### Dashboard "Relacionamento"
- Gadget 1: Usa `interactionsThisMonth` (agrupado por Tipo de Interação)
- Gadget 2: Usa `noRecentInteractions` (complemento: sem reunião)
- Gadget 3: Usa `interactionsThisMonth` + filtro de "Tipo de Interação" = "Reunião"
- Gadget 4: Usa `interactionsThisMonth` + filtro de "Tipo de Interação" = "Evento"

### Dashboard "Crescimento"
- Gadget 1: Usa `openOpportunities`
- Gadget 2: Usa `openOpportunities` + filtro de "Tipo de registro" = "Indicação"
- Gadget 3: Usa `activeAccounts` + filtro de "Health Score" >= 75
- Gadget 4: Usa `upcomingRenewals`

---

## Boas Práticas

1. **Testabilidade**: Todos os filtros foram testados e validados
2. **Clareza**: Nomes descritivos que indicam conteúdo
3. **Reutilização**: Filtros base podem ser combinados com filtros adicionais
4. **Performance**: JQL simples, evitando queries complexas
5. **Manutenibilidade**: Documentação clara do propósito de cada filtro

---

## Referência Rápida - Cópia para Jira

Use os JQL abaixo diretamente no Jira:

```
# Clientes em risco
project = CSM AND "Ciclo da Conta" = "Risco"

# Renovações próximas (90 dias)
project = CSM AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d")

# Sem interação há 60 dias
project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d

# Oportunidades abertas
project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done

# Interações deste mês
project = CSM AND issuetype = "Interação" AND "Data da interação" >= startOfMonth()

# Contas churnadas
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Churn"

# Contas ativas
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo"
```
