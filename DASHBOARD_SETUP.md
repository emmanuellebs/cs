# Configuração de Dashboards - Jira CS

## Visão Geral

Total de **3 dashboards** com **12 gadgets** no total, cada um com JQL explícito.

```
┌─ Dashboard 1: Saúde da Base ────────────────────┐
│ • Clientes por Health Score                     │
│ • Clientes em Risco                             │
│ • Clientes com Baixa Atividade                  │
│ • Clientes Sem Contato há 60 Dias               │
└─────────────────────────────────────────────────┘

┌─ Dashboard 2: Relacionamento ──────────────────┐
│ • Interações por Tipo                           │
│ • Clientes Sem Reunião Recente                 │
│ • Reuniões Realizadas (Mês)                    │
│ • Participação em Eventos                       │
└─────────────────────────────────────────────────┘

┌─ Dashboard 3: Crescimento ────────────────────┐
│ • Oportunidades em Aberto                       │
│ • Indicações Recebidas                          │
│ • Clientes Potenciais para Case                │
│ • Renovações Próximas (90 dias)                │
└─────────────────────────────────────────────────┘
```

---

## Dashboard 1: "CSM - Saúde da Base"

**ID Lógico**: `health`

**Nome**: CSM - Saúde da Base

**Descrição**: Visão consolidada da saúde da carteira de clientes, com indicadores de risco, atividade e satisfação.

**Públicot**: Gerentes de CS, Diretores, Executivos

### Gadget 1: Clientes por Health Score

**Nome**: Clientes por Health Score

**Descrição**: Distribuição dos clientes por faixas de Health Score

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" ORDER BY "Health Score" DESC
```

**Tipo Sugerido**: Two Dimensional Filter Statistics

**Configuração Recomendada**:
- Eixo X: Health Score (agrupado em faixas: 0-25, 26-50, 51-75, 76-100)
- Eixo Y: Count
- Filtro: Todos os clientes

**Insight**: Mostra distribuição de saúde da base

---

### Gadget 2: Clientes em Risco

**Nome**: Clientes em Risco

**Descrição**: Clientes com ciclo da conta em estado de Risco - requerem ação imediata

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Risco" ORDER BY updated DESC
```

**Tipo Sugerido**: Filter Results ou Two Dimensional Statistics

**Configuração Recomendada**:
- Exibir: Key, Summary, Health Score, MRR
- Ordenação: updated DESC
- Limite: 20 resultados

**Insight**: Alertas de contas críticas

---

### Gadget 3: Clientes com Baixa Atividade

**Nome**: Clientes com Baixa Atividade

**Descrição**: Clientes com baixo engajamento de plataforma

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Engajamento da plataforma" = "Baixo" ORDER BY updated DESC
```

**Tipo Sugerido**: Filter Results

**Configuração Recomendada**:
- Exibir: Key, Summary, Engajamento, Última atividade
- Ordenação: updated DESC
- Limite: 15 resultados

**Insight**: Contas com potencial de engajamento

---

### Gadget 4: Clientes Sem Contato há 60 Dias

**Nome**: Clientes Sem Contato há 60 Dias

**Descrição**: Clientes com última atualização >= 60 dias

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d ORDER BY updated ASC
```

**Tipo Sugerido**: Filter Results

**Configuração Recomendada**:
- Exibir: Key, Summary, Última atualização, Contato principal
- Ordenação: updated ASC (mais antigos primeiro)
- Limite: 10 resultados

**Insight**: Contas dormentes/abandonadas

---

## Dashboard 2: "CSM - Relacionamento"

**ID Lógico**: `relationship`

**Nome**: CSM - Relacionamento

**Descrição**: Indicadores de qualidade do relacionamento através de frequência de interações e tipos de comunicação.

**Público**: Gerentes de CS, Especialistas de Relacionamento

### Gadget 1: Interações por Tipo

**Nome**: Interações por Tipo

**Descrição**: Volume de interações estratificado por tipo de interação

**JQL**:
```jql
project = CSM AND issuetype = "Interação" ORDER BY "Data da interação" DESC
```

**Tipo Sugerido**: Two Dimensional Filter Statistics

**Configuração Recomendada**:
- Eixo X: Tipo de Interação (Reunião, Suporte, Feedback, Treinamento, Evento)
- Eixo Y: Count
- Filtro: Todas as interações
- Período: Últimos 30-90 dias

**Insight**: Distribuição de atividades de relacionamento

---

### Gadget 2: Clientes Sem Reunião Recente

**Nome**: Clientes Sem Reunião Recente

**Descrição**: Clientes sem interação do tipo Reunião nos últimos 30 dias

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND updated <= -30d AND NOT EXISTS(linkedIssue in (type = "Interação" AND "Tipo de interação" = "Reunião" AND updated >= -30d)) ORDER BY updated ASC
```

**Tipo Sugerido**: Filter Results

**Configuração Recomendada**:
- Exibir: Key, Summary, Contato principal
- Ordenação: updated ASC
- Limite: 10 resultados

**Insight**: Contas que precisam de reengajamento através de reunião

---

### Gadget 3: Reuniões Realizadas (Mês)

**Nome**: Reuniões Realizadas (Mês)

**Descrição**: Interações do tipo Reunião no período atual (mês Gregoriano)

**JQL**:
```jql
project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND "Data da interação" >= startOfMonth() ORDER BY "Data da interação" DESC
```

**Tipo Sugerido**: Issue Statistics ou Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Data da Interação
- Ordenação: Data da Interação DESC
- Métrica: Count total de reuniões

**Insight**: Volume de reuniões no mês corrente

---

### Gadget 4: Participação em Eventos

**Nome**: Participação em Eventos

**Descrição**: Interações do tipo Evento registradas no período

**JQL**:
```jql
project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Evento" ORDER BY "Data da interação" DESC
```

**Tipo Sugerido**: Issue Statistics ou Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Data, Cliente (linkedTo Cliente)
- Ordenação: Data DESC
- Limite: 20 resultados

**Insight**: Engajamento em eventos e webinars

---

## Dashboard 3: "CSM - Crescimento"

**ID Lógico**: `growth`

**Nome**: CSM - Crescimento

**Descrição**: Indicadores focados em expansão, oportunidades, indicações e renovações - foco em Revenue Growth.

**Público**: Diretores, Executivos, Especialistas de Vendas

### Gadget 1: Oportunidades em Aberto

**Nome**: Oportunidades em Aberto

**Descrição**: Oportunidades ainda em andamento e não concluídas

**JQL**:
```jql
project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done ORDER BY created DESC
```

**Tipo Sugerido**: Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Valor estimado, Probabilidade
- Ordenação: created DESC (mais recentes primeiro)
- Limite: 20 resultados

**Insight**: Pipeline de oportunidades ativas

---

### Gadget 2: Indicações Recebidas

**Nome**: Indicações Recebidas

**Descrição**: Registros de oportunidades do tipo Indicação

**JQL**:
```jql
project = CSM AND issuetype = "Oportunidade" AND "Tipo de registro" = "Indicação" ORDER BY created DESC
```

**Tipo Sugerido**: Issue Statistics ou Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Cliente (linkedTo), Valor
- Ordenação: created DESC
- Métrica: Count total + Valor total estimado

**Insight**: Volume e valor de indicações geradas por clientes

---

### Gadget 3: Clientes Potenciais para Case

**Nome**: Clientes Potenciais para Case

**Descrição**: Clientes ativos com alto Health Score - potencial para case studies

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo" AND "Health Score" >= 75 ORDER BY "Health Score" DESC
```

**Tipo Sugerido**: Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Health Score, MRR, Produto
- Ordenação: Health Score DESC (maior primeiro)
- Limite: 15 resultados

**Insight**: Clientes satisfeitos disponíveis para referências/cases

---

### Gadget 4: Renovações Próximas (90 dias)

**Nome**: Renovações Próximas (90 dias)

**Descrição**: Contratos com renovação prevista nos próximos 90 dias

**JQL**:
```jql
project = CSM AND issuetype = "Conta Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d") ORDER BY "Data de renovação" ASC
```

**Tipo Sugerido**: Two Dimensional Statistics ou Filter Results

**Configuração Recomendada**:
- Exibir: Key, Resumo, Data de renovação, MRR, Ciclo da Conta
- Ordenação: Data de Renovação ASC (mais próximas primeiro)
- Limite: 20 resultados
- Alerta: Destacar renovações nos próximos 30 dias

**Insight**: Pipeline de renovações - oportunidade de upsell

---

## Instruções de Criação Manual

Como os dashboards não podem ser criados via API em Jira Cloud (restrições), siga estes passos:

### Passo 1: Criar Dashboard

1. Acesse Dashboards → Create Dashboard
2. Nome: "CSM - Saúde da Base" (repetir para cada dashboard)
3. Descrição: Copiar descrição acima
4. Clique em "Create"

### Passo 2: Adicionar Gadgets

1. Clique em "Edit"
2. Clique em "Add Gadget"
3. Busque por "Filter Results" ou "Two Dimensional Filter Statistics"
4. Configure com o JQL fornecido acima
5. Salve

### Passo 3: Ordenar Gadgets

1. Em modo Edit, reorganize a ordem dos gadgets
2. Agrupe visualmente por objetivo (saúde, relacionamento, crescimento)

### Passo 4: Compartilhar

1. Clique em "Share"
2. Selecione: "Project CSM - Users"
3. Permissão: "View"

---

## Métricas Chave por Dashboard

### Dashboard 1: Saúde da Base
- **KPI 1**: Distribuição de Health Score (% em alto, médio, baixo)
- **KPI 2**: Número de clientes em risco (alerta se > 10%)
- **KPI 3**: Clientes dormentes (última atividade > 60d)
- **Ação**: Reengajamento, revisão de saúde

### Dashboard 2: Relacionamento
- **KPI 1**: Reuniões/mês por cliente (alvo: 1+)
- **KPI 2**: Diversidade de tipos de interação
- **KPI 3**: Clientes sem contato > 30 dias
- **Ação**: Agendar touchpoints, aumentar frequência

### Dashboard 3: Crescimento
- **KPI 1**: Pipeline de oportunidades ($)
- **KPI 2**: Taxa de conversão de indicações
- **KPI 3**: Renovação rate nos próximos 90 dias
- **Ação**: Priorizar oportunidades, preparar renovações

---

## Frequência de Revisão Recomendada

| Dashboard | Frequência | Responsável |
|-----------|-----------|-------------|
| Saúde da Base | Semanal | Gerente CS |
| Relacionamento | Semanal | Especialista CS |
| Crescimento | Semanal/Mensal | Diretor, VP Sales |

---

## Integração com Alertas

Considere configurar alertas automatizados baseados nestes gadgets:

1. **Alerta**: Clientes em Risco (> 5 novos)
2. **Alerta**: Sem interação (> 60 dias)
3. **Alerta**: Renovação crítica (< 30 dias)
4. **Alerta**: Indicações (quando criadas)

Use JQL com Rules Engine ou Webhooks do Jira para automação.

---

## Referência de JQL por Gadget

Para copiar/colar rápido no Jira:

```
# Dashboard 1 - Saúde
project = CSM AND issuetype = "Conta Cliente" ORDER BY "Health Score" DESC
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Risco" ORDER BY updated DESC
project = CSM AND issuetype = "Conta Cliente" AND "Engajamento da plataforma" = "Baixo" ORDER BY updated DESC
project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d ORDER BY updated ASC

# Dashboard 2 - Relacionamento
project = CSM AND issuetype = "Interação" ORDER BY "Data da interação" DESC
project = CSM AND issuetype = "Conta Cliente" AND updated <= -30d
project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND "Data da interação" >= startOfMonth()
project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Evento" ORDER BY "Data da interação" DESC

# Dashboard 3 - Crescimento
project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done ORDER BY created DESC
project = CSM AND issuetype = "Oportunidade" AND "Tipo de registro" = "Indicação" ORDER BY created DESC
project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo" AND "Health Score" >= 75 ORDER BY "Health Score" DESC
project = CSM AND issuetype = "Conta Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d")
```
