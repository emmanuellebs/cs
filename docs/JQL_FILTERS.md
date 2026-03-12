# Filtros JQL base (CS)

Lista dos filtros recomendados para o processo de Customer Success.

## CSM - Board base

Filtro base para o board Kanban de lifecycle.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM ORDER BY updated DESC
```

## CSM - Clientes em risco

Clientes com risco de churn identificado.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND "Status da conta" = "Risco" ORDER BY updated DESC
```

## CSM - Renovações próximas

Contas com renovação próxima.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("\u002b90d") ORDER BY "Data de renovação" ASC
```

## CSM - Clientes sem interação recente

Clientes sem interações nos últimos 60 dias.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d ORDER BY updated ASC
```

## CSM - Oportunidades em aberto

Oportunidades CS ainda em andamento.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Oportunidade CS" AND statusCategory != Done ORDER BY created DESC
```

## CSM - Contas por estágio do lifecycle

Visão geral por estágio de lifecycle.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Conta Cliente"
```

## CSM - Contas ativas

Contas em estágio de cliente ativo.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Conta Cliente" AND "Status da conta" = "Ativo"
```

## CSM - Contas churnadas

Contas marcadas como churn.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Conta Cliente" AND "Status da conta" = "Churn"
```

## CSM - Interações do mês

Interações registradas no mês atual.

- **Status**: skipped
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Interação" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC
```

