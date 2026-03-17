# Estrutura Final do Jira - WH Customer Success

## Visão Geral
Na estrutura final, **tudo é analisado em um único lugar: na issue "Cliente"**.

## Arquitetura de Issues

```
┌─────────────────────────────────────────────────────────┐
│ Cliente (Conta Principal)                               │
│ ├── conta principal                                      │
│ ├── segmento, MRR, health score, NPS                    │
│ └── status (Ativo, Onboarding, Churn, etc.)             │
│                                                         │
│ ├─ Interação (Histórico de Relacionamento)              │
│ │  ├── tipo, data, resumo, insight                      │
│ │  └── vinculada ao Cliente                             │
│ │                                                       │
│ ├─ Plano de Sucesso (Estratégia do Cliente)             │
│ │  ├── objetivos, marcos, timeline                      │
│ │  └── vinculado ao Cliente                             │
│ │                                                       │
│ ├─ Risco (Prevenção de Churn)                           │
│ │  ├── tipo de risco, severidade, mitigação             │
│ │  └── vinculado ao Cliente                             │
│ │                                                       │
│ ├─ Oportunidade (Expansão)                              │
│ │  ├── tipo de oportunidade, valor                      │
│ │  └── vinculada ao Cliente                             │
│ │                                                       │
│ └─ Renovação (Gestão Contratual)                        │
│    ├── data, valor, termos                              │
│    └── vinculada ao Cliente                             │
└─────────────────────────────────────────────────────────┘
```

## Board Kanban (8 Colunas)

O board exibe as issues passando por **8 etapas**:

1. **Análise de Perfil** - Conhecer o cliente
2. **Implantação** - Setup e integração
3. **Lançamento** - Go-live
4. **Acompanhamento 1** - Primeiras semanas
5. **Acompanhamento 2** - Consolidação
6. **Expansão** - Oportunidades de crescimento
7. **Renovação** - Processo de renovação
8. **Cancelamento** - Saída / Reativação

## Fluxo de Dados

### Criar Cliente
```
1. Novo Cliente criado (ex: Empresa XYZ)
2. Status inicial: Onboarding
3. Aparece na coluna "Análise de Perfil" do board
```

### Adicionar Interação
```
1. Usuario cria issue "Interação" 
2. Vincula à issue "Cliente" (XYZ)
3. Registra histórico completo de relacionamento
4. Aparece na mesma coluna do Cliente no board
```

### Rastrear Riscos
```
1. Se risco identificado, criar issue "Risco"
2. Vincular ao Cliente
3. Apareça na coluna conforme o lifecycle do cliente
4. Mover para "Cancelamento" se churn confirmado
```

### Gestionar Renovação
```
1. Criar issue "Renovação" quando apropriado
2. Vincular ao Cliente
3. Rastrear através da coluna "Renovação"
4. Atualizar status conforme progresso
```

## Dashboards (3 Visões)

### 1. Saúde da Base
- Clientes por Health Score
- Clientes em risco
- Clientes sem contato (60 dias)
- Segmentação por produto

### 2. Relacionamento
- Interações por cliente
- Engajamento da comunidade
- Reuniões realizadas
- Participação em eventos

### 3. Crescimento
- Expansões em andamento
- Oportunidades por tipo
- Renovações por período
- MRR por conta

## Próximas Ações

1. ✅ Board criado (ID 206)
2. ✅ Issue types criados (6 tipos)
3. ⏳ **PRÓXIMO**: Renomear colunas do board
4. ⏳ **PRÓXIMO**: Vincular issue types ao board
5. ⏳ Provisionar campos (38 campos customizados)
6. ⏳ Criar dashboards (3 dashboards)
7. ⏳ Configurar relacionamentos entre issues

## Comando Final

```bash
npm run start -- --dryRun=false
```

Isso provisiona:
- 38 campos customizados
- 3 dashboards
- 9 filtros JQL
- Relacionamentos automáticos
