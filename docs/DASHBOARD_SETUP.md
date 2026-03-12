# Configuração de dashboards (CS)

Os dashboards podem ser criados parcialmente via API. Abaixo segue o blueprint completo para montagem manual de gadgets.

## CSM - Saúde da base

Visão geral da saúde da base de clientes.

- **Status**: skipped
- **Dashboard ID**: n/d

### Gadgets recomendados

| Gadget | Tipo sugerido | Filtro associado |
| ------ | ------------- | ---------------- |
| Clientes por health score | Gráfico de barras por faixas de Health Score | CSM - Contas por estágio do lifecycle |
| Clientes em risco | Issue statistics por Status da conta | CSM - Clientes em risco |
| Clientes com baixa atividade | Filter results | CSM - Clientes sem interação recente |
| Clientes sem contato há 60 dias | Filter results | CSM - Clientes sem interação recente |

## CSM - Relacionamento

Indicadores de relacionamento e interações.

- **Status**: skipped
- **Dashboard ID**: n/d

### Gadgets recomendados

| Gadget | Tipo sugerido | Filtro associado |
| ------ | ------------- | ---------------- |
| Interações por mês | Two dimensional filter statistics (por tipo de interação e mês) | CSM - Interações do mês |
| Clientes sem reunião | Filter results | CSM - Clientes sem interação recente |
| Reuniões realizadas | Filter statistics por Tipo de interação = Reunião | CSM - Interações do mês |
| Participação em eventos | Filter statistics por Tipo de interação = Evento | CSM - Interações do mês |

## CSM - Crescimento

Foco em expansão, indicações e renovações.

- **Status**: skipped
- **Dashboard ID**: n/d

### Gadgets recomendados

| Gadget | Tipo sugerido | Filtro associado |
| ------ | ------------- | ---------------- |
| Expansões em andamento | Filter results | CSM - Oportunidades em aberto |
| Indicações recebidas | Filter statistics por Tipo de registro = Indicação | CSM - Oportunidades em aberto |
| Clientes potenciais para case | Filter results com Health Score alto | CSM - Contas ativas |
| Contratos renovados | Filter statistics por Status da conta = Renovado | CSM - Contas ativas |

