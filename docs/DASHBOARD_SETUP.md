# Configuração de dashboards (CS)

Os dashboards podem ser criados parcialmente via API. Abaixo segue o blueprint completo para montagem manual de gadgets.

## CSM - Saúde da base

Visão geral da saúde da base de clientes com indicadores de risco, atividade e scores de saúde.

- **Status**: reused
- **Dashboard ID**: 10267

### Gadgets recomendados

| Gadget | Tipo sugerido |
| ------ | ------------- |
| Clientes por health score | Gadget de distribuição/estatísticas por Health Score |
| Clientes em risco | Filter results ou Two dimensional statistics |
| Clientes com baixa atividade | Filter results |
| Clientes sem contato há 60 dias | Filter results |

## CSM - Relacionamento

Indicadores de qualidade do relacionamento através de interações e comunicação.

- **Status**: reused
- **Dashboard ID**: 10268

### Gadgets recomendados

| Gadget | Tipo sugerido |
| ------ | ------------- |
| Interações por mês | Two dimensional filter statistics (por Tipo de interação) |
| Clientes sem reunião recente | Filter results |
| Reuniões realizadas | Filter statistics ou Issue statistics |
| Participação em eventos | Issue statistics |

## CSM - Crescimento

Indicadores focados em expansão, oportunidades, indicações e renovações.

- **Status**: reused
- **Dashboard ID**: 10269

### Gadgets recomendados

| Gadget | Tipo sugerido |
| ------ | ------------- |
| Oportunidades em aberto | Filter results |
| Indicações recebidas | Issue statistics ou Filter results |
| Clientes potenciais para case | Filter results |
| Renovações próximas | Filter results ou Two dimensional statistics |

