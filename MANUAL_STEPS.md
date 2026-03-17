# Passos Manuais - Jira CS

## Visão Geral

Este documento contém as etapas que devem ser executadas manualmente na interface do Jira, pois não podem ser automatizadas via API (restrições Jira Cloud).

## Pré-requisitos

- ✅ Projeto CSM criado (ID: 10104, Key: CSM)
- ✅ Board Kanban "WH - Customer Success" criado (ID: 206)
- ✅ 6 Issue Types criados (Cliente, Interação, Plano de Sucesso, Risco, Oportunidade, Renovação)
- ✅ ~40 campos customizados criados e configurados
- ✅ 9 filtros JQL criados
- ✅ Relacionamentos (Linked Issues) configurados

## Etapa 1: Verificar Configuração de Issue Types

### 1.1 Acessar Project Settings

1. Projeto CSM → Project Settings (engrenagem)
2. Clique em "Issue types" (menu esquerdo)
3. Verificar que todas as 6 types estão listadas:
   - [ ] Cliente (Conta Cliente)
   - [ ] Interação
   - [ ] Plano de Sucesso
   - [ ] Risco
   - [ ] Oportunidade
   - [ ] Renovação

### 1.2 Configurar Campos por Issue Type

Para cada issue type, configurar quais campos aparecem no formulário de criação:

**Cliente**:
1. Clique em "Cliente" → "Configure fields"
2. Garantir estes campos estão visíveis:
   - [x] Segmento
   - [x] MRR
   - [x] Health Score
   - [x] NPS
   - [x] Engagement
   - [x] Data de renovação
   - [x] Produto
   - [x] Ciclo da Conta ⭐ (DEVE estar aqui)
   - [x] Contato Principal (all 5 fields)
3. Clique "Save"

**Interação**:
1. Clique em "Interação" → "Configure fields"
2. Garantir estes campos:
   - [x] Tipo de interação
   - [x] Data da interação
   - [x] Resumo
   - [x] Insight
   - [x] Sentimento
   - [x] Próximos passos
3. Clique "Save"

**Plano de Sucesso**:
1. Clique em "Plano de Sucesso" → "Configure fields"
2. Garantir estes campos:
   - [x] Objetivo
   - [x] Tipo de ação
   - [x] Prioridade
   - [x] Prazo
   - [x] Responsável
   - [x] Métrica
3. Clique "Save"

**Risco**:
1. Clique em "Risco" → "Configure fields"
2. Garantir estes campos:
   - [x] Tipo de registro
   - [x] Probabilidade
   - [x] Valor estimado
   - [x] Motivo
   - [x] Plano de ação
3. Clique "Save"

**Oportunidade**:
1. Mesmo que Risco (compartilham campos)

**Renovação**:
1. Mesmo que Risco (compartilham campos)

---

## Etapa 2: Configurar Board Kanban

### 2.1 Acessar Configuração do Board

1. Projeto CSM → Board → "Board settings" (⚙️)
2. Clique em "Board" (abaixo)

### 2.2 Verificar Coluna do Board

**Coluna atual** (criada manualmente):
- [ ] Já existe "Análise de Perfil"?
- [ ] Já existe "Implantação"?
- [ ] ... (todos os 8 stages)?

Se **NÃO** (board vazio ou com colunas wrong):

1. Clique em "Edit board settings"
2. Delete colunas incorretas
3. Clique em "Create column"
4. Adicione 8 colunas na ordem:
   - [x] Análise de Perfil
   - [x] Implantação
   - [x] Lançamento
   - [x] Acompanhamento 1
   - [x] Acompanhamento 2
   - [x] Expansão
   - [x] Renovação
   - [x] Cancelamento
5. Clique "Save"

### 2.3 Configurar Coluna Done

1. "Board settings" → "Column Mapping"
2. Mapeie "Cancelamento" → Status "Done"
3. Salve

### 2.4 Filtro do Board (Issue Type)

**Importante**: Board deve mostrar APENAS tipo "Cliente"

1. Board → Clique no ícone de "Filter" (funil)
2. Filtre: `issuetype = "Conta Cliente"`
3. Aplique filtro (deve mostrar apenas "Cliente")

---

## Etapa 3: Criar Dashboards

### 3.1 Dashboard 1: "CSM - Saúde da Base"

1. Dashboards → "Create dashboard"
2. Nome: `CSM - Saúde da Base`
3. Descrição: `Visão consolidada da saúde da carteira de clientes`
4. Clique "Create"

**Adicione 4 Gadgets**:

**Gadget 1**: Clientes por Health Score
- Clique "Edit" → "Add Gadget"
- Busque: "Two Dimensional Filter Statistics"
- Configure:
  - Name: "Clientes por Health Score"
  - Columns: Clique em "Columns"
  - JQL: `project = CSM AND issuetype = "Conta Cliente" ORDER BY "Health Score" DESC`
  - Agrupamento X: "Health Score"
  - Clique "Save"

**Gadget 2**: Clientes em Risco
- "Add Gadget" → "Filter Results"
- Nome: "Clientes em Risco"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Risco"`
- Clique "Save"

**Gadget 3**: Clientes com Baixa Atividade
- "Add Gadget" → "Filter Results"
- Nome: "Clientes com Baixa Atividade"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Engajamento da plataforma" = "Baixo"`
- Clique "Save"

**Gadget 4**: Clientes Sem Contato há 60 Dias
- "Add Gadget" → "Filter Results"
- Nome: "Clientes Sem Contato há 60 Dias"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND updated <= -60d`
- Clique "Save"

**Finalizar**: Clique "Done" para sair de Edit

---

### 3.2 Dashboard 2: "CSM - Relacionamento"

1. Dashboards → "Create dashboard"
2. Nome: `CSM - Relacionamento`
3. Descrição: `Indicadores de qualidade do relacionamento`
4. Clique "Create"

**Adicione 4 Gadgets**:

**Gadget 1**: Interações por Tipo
- "Add Gadget" → "Two Dimensional Filter Statistics"
- Nome: "Interações por Tipo"
- JQL: `project = CSM AND issuetype = "Interação"`
- Agrupamento: "Tipo de interação"
- Clique "Save"

**Gadget 2**: Clientes Sem Reunião Recente
- "Add Gadget" → "Filter Results"
- Nome: "Clientes Sem Reunião Recente"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND updated <= -30d`
- Clique "Save"

**Gadget 3**: Reuniões Realizadas (Mês)
- "Add Gadget" → "Issue Statistics"
- Nome: "Reuniões Realizadas"
- JQL: `project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND "Data da interação" >= startOfMonth()`
- Clique "Save"

**Gadget 4**: Participação em Eventos
- "Add Gadget" → "Issue Statistics"
- Nome: "Participação em Eventos"
- JQL: `project = CSM AND issuetype = "Interação" AND "Tipo de interação" = "Evento"`
- Clique "Save"

**Finalizar**: Clique "Done"

---

### 3.3 Dashboard 3: "CSM - Crescimento"

1. Dashboards → "Create dashboard"
2. Nome: `CSM - Crescimento`
3. Descrição: `Indicadores de expansão, oportunidades e renovações`
4. Clique "Create"

**Adicione 4 Gadgets**:

**Gadget 1**: Oportunidades em Aberto
- "Add Gadget" → "Filter Results"
- Nome: "Oportunidades em Aberto"
- JQL: `project = CSM AND issuetype = "Oportunidade" AND statusCategory != Done`
- Clique "Save"

**Gadget 2**: Indicações Recebidas
- "Add Gadget" → "Issue Statistics"
- Nome: "Indicações Recebidas"
- JQL: `project = CSM AND issuetype = "Oportunidade" AND "Tipo de registro" = "Indicação"`
- Clique "Save"

**Gadget 3**: Clientes Potenciais para Case
- "Add Gadget" → "Filter Results"
- Nome: "Clientes Potenciais para Case"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Ciclo da Conta" = "Ativo" AND "Health Score" >= 75`
- Clique "Save"

**Gadget 4**: Renovações Próximas
- "Add Gadget" → "Two Dimensional Filter Statistics"
- Nome: "Renovações Próximas (90 dias)"
- JQL: `project = CSM AND issuetype = "Conta Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d")`
- Clique "Save"

**Finalizar**: Clique "Done"

---

## Etapa 4: Configurar Automações (Opcional)

Se deseja configurar automações conforme especificado em `AUTOMATION_BLUEPRINT.md`:

### 4.1 Alerta - Cliente em Risco

1. Projeto CSM → Project Settings → Automation
2. "Create rule"
3. **Trigger**: Issue updated
4. **Conditions**:
   - Issue type is Cliente
   - Ciclo da Conta changed to Risco
5. **Actions**:
   - Send email to: [seu email]
   - Subject: "Cliente em Risco: {{issue.key}}"
6. Clique "Create" → "Enable"

### 4.2 Auto-sync Ciclo da Conta

1. "Create rule"
2. **Trigger**: Issue moved to column
3. **Conditions**: Issue type is Cliente
4. **Actions**: Set field "Ciclo da Conta" = [valor da coluna]
   - Move to "Lançamento" → Ciclo = Onboarding
   - Move to "Acompanhamento 1" → Ciclo = Ativo
   - (etc.)
5. Clique "Create" → "Enable"

---

## Etapa 5: Testar Workflows Básicos

### 5.1 Criar Cliente de Teste

1. Board → "+ Create"
2. Type: Cliente
3. Summary: "Test Cliente - Acme Corp"
4. Preencha:
   - Segmento: Enterprise
   - MRR: 10000
   - Health Score: 75
   - **Ciclo da Conta**: Onboarding
5. Clique "Create"

### 5.2 Criar Interação Linkedada

1. "+ Create" na mesma tela
2. Type: Interação
3. Summary: "Reunião de Kickoff"
4. Preencha:
   - Tipo: Reunião
   - Data: [today]
5. Clique "Create"
6. Clique no issue criado → "Link issue"
7. Link type: "relates to"
8. Search for: "Test Cliente - Acme Corp"
9. Clique "Link"

### 5.3 Verificar Visualização

1. Volte para o Cliente criado
2. Veja section "Links" → deve mostrar Interação linkedada
3. Veja o formulário → deve mostrar todos os campos

---

## Etapa 6: Compartilhar Acesso

### 6.1 Project Permissions

1. Projeto CSM → Project Settings → "People"
2. Clique "+ Add people"
3. Adicione seu time:
   - [ ] Gerentes CS
   - [ ] Especialistas CS
   - [ ] Diretores
4. Role: "Member"
5. Clique "Invite"

### 6.2 Compartilhar Dashboards

1. Dashboard → "..." → "Share"
2. Clique "Share with project"
3. Projeto: CSM
4. Permission: View
5. Clique "Save"

---

## Etapa 7: Verificação Final

### Checklist de Configuração

- [ ] 6 Issue Types criados
- [ ] ~40 campos customizados visivelmente no formulário
- [ ] Board Kanban com 8 colunas (Análise → Cancelamento)
- [ ] Dashboard 1 "Saúde da Base" com 4 gadgets
- [ ] Dashboard 2 "Relacionamento" com 4 gadgets
- [ ] Dashboard 3 "Crescimento" com 4 gadgets
- [ ] 9 Filtros JQL criados
- [ ] Linked Issues funcionando (Interação linkedada a Cliente)
- [ ] Automações básicas (alerta risco) testadas
- [ ] Acesso compartilhado com time

### Validação de Funcionalidade

1. **Criar Cliente**:
   - [ ] Cria issue tipo Cliente
   - [ ] Ciclo da Conta aparece no formulário
   - [ ] Contato Principal fields aparecem

2. **Criar Interação**:
   - [ ] Cria issue tipo Interação
   - [ ] Permite linkar a Cliente
   - [ ] Tipo/Data/Sentimento funcionam

3. **Visualizar no Board**:
   - [ ] Cliente aparece no board
   - [ ] Interação NÃO aparece no board (apenas linkedada)
   - [ ] Transitions entre colunas funcionam

4. **Dashboards**:
   - [ ] "Saúde da Base" mostra dados
   - [ ] "Relacionamento" mostra interações
   - [ ] "Crescimento" mostra oportunidades/renovações

---

## Troubleshooting

### Problema: Campo "Ciclo da Conta" não aparece no formulário

**Solução**:
1. Project Settings → Issue types → Cliente
2. Clique "Configure fields"
3. Procure "Ciclo da Conta" na lista
4. Se não vê: Field → "Add field" → Search "Ciclo" → Select
5. "Save"

### Problema: Board mostra todas as issue types (não apenas Cliente)

**Solução**:
1. Board → "Board settings"
2. Clique em "Filter"
3. Mude o filtro para: `issuetype = "Conta Cliente"`
4. "Save"

### Problema: Linked Issue não funciona

**Solução**:
1. Project Settings → Issue linking
2. Garanta que "relates to" link type existe
3. Se não: "Create link type" → Nome: "relates to"
4. Teste novamente

### Problema: Dashboard gadgets vazios (sem dados)

**Solução**:
1. Verifique JQL: Projeto CSM → Filters → Busque o filtro
2. Execute manualmente a JQL
3. Se retorna resultados: Widget deve popular
4. Se retorna vazio: JQL pode estar incorreta

---

## Próximos Passos Pós-Setup

1. **Importar Dados Iniciais**:
   - Criar issues de Cliente existentes
   - Ligar interações históri

2. **Treinar Time**:
   - Como criar/editar issues
   - Como usar board Kanban
   - Como ler dashboards

3. **Monitorar & Otimizar**:
   - Revisar alertas
   - Coletar feedback do time
   - Ajustar automações/campos conforme necessário

4. **Integração com Sistemas Externos**:
   - Se necessário: Zapier/Webhooks para sincronizar com CRM
   - Considerar Scripts for Jira para automações avançadas

---

## Referência Rápida - URLs

| Recurso | URL |
|---------|-----|
| Projeto CSM | https://whd.atlassian.net/jira/software/c/projects/CSM/board |
| Project Settings | https://whd.atlassian.net/jira/software/c/projects/CSM/settings |
| Dashboards | https://whd.atlassian.net/jira/software/c/dashboards |
| Filters | https://whd.atlassian.net/jira/issues/?jql=project=CSM |
| Automation | https://whd.atlassian.net/jira/software/c/projects/CSM/settings/automation |

---

## Suporte & Documentação

- **Jira Cloud Admin**: https://support.atlassian.com/jira-cloud/
- **Board Configuration**: https://support.atlassian.com/jira-software-cloud/articles/configure-a-kanban-board/
- **Dashboards**: https://support.atlassian.com/jira-software-cloud/articles/add-gadgets-to-a-dashboard/
- **Automation**: https://support.atlassian.com/jira-software-cloud/articles/what-is-automation-for-jira-cloud/
