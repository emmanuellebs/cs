# Filtros JQL base (CS)

Lista dos filtros recomendados para o processo de Customer Success.

## CSM - Board base

Filtro base para o board Kanban de lifecycle.

- **Status**: failed
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM ORDER BY updated DESC
```

## CSM - Clientes em risco

Clientes com risco de churn identificado.

- **Status**: created
- **Filtro ID**: 10701
- **JQL**:

```text
project = CSM AND "Ciclo da Conta" = "Risco" ORDER BY updated DESC
```

## CSM - Renovações próximas

Contas com renovação próxima.

- **Status**: created
- **Filtro ID**: 10702
- **JQL**:

```text
project = CSM AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("\u002b90d") ORDER BY "Data de renovação" ASC
```

## CSM - Clientes sem interação recente

Clientes sem interações nos últimos 60 dias.

- **Status**: failed
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Cliente" AND updated <= -60d ORDER BY updated ASC
```

## CSM - Oportunidades em aberto

Oportunidades CS ainda em andamento.

- **Status**: failed
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done ORDER BY created DESC
```

## CSM - Contas por estágio do lifecycle

Visão geral por estágio de lifecycle.

- **Status**: failed
- **Filtro ID**: n/d
- **JQL**:

```text
project = CSM AND issuetype = "Cliente"
```

## CSM - Contas ativas

Contas em estágio de cliente ativo.

- **Status**: created
- **Filtro ID**: 10703
- **JQL**:

```text
project = CSM AND issuetype = "Cliente" AND "Ciclo da Conta" = "Ativo"
```

## CSM - Contas churnadas

Contas marcadas como churn.

- **Status**: created
- **Filtro ID**: 10704
- **JQL**:

```text
project = CSM AND issuetype = "Cliente" AND "Ciclo da Conta" = "Churn"
```

## CSM - Interações do mês

Interações registradas no mês atual.

- **Status**: created
- **Filtro ID**: 10705
- **JQL**:

```text
project = CSM AND issuetype = "Interação" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC
```

