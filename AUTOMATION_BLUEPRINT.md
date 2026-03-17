# Automação Blueprint - Jira CS

## Visão Geral

Documentação de automações recomendadas para suportar o lifecycle de CS em Jira Cloud.

## Automações Recomendadas

### 1. Atualizar Ciclo da Conta - Transições Automáticas

**Objetivo**: Sincronizar "Ciclo da Conta" com progressão no board

**Tipo**: Rule (Jira Automation)

**Trigger**: Issue transitions to column X

| Quando | Então | Detalhes |
|--------|-------|----------|
| Issue vai para "Lançamento" | Definir Ciclo = Onboarding | Cliente em primeiros passos |
| Issue vai para "Acompanhamento 1" | Definir Ciclo = Ativo | Cliente em produção |
| Issue vai para "Acompanhamento 2" | Definir Ciclo = Adoção | Cliente aumentando uso |
| Issue vai para "Expansão" | Definir Ciclo = Expansão | Oportunidades de crescimento |
| Issue vai para "Renovação" | Definir Ciclo = Renovação | Processo de renovação ativo |
| Issue vai para "Cancelamento" | Definir Ciclo = Churn | Cliente finalizado |

**Configuração Jira**:
```
Rule name: Auto-sync Ciclo da Conta com Board Stage
Trigger: Issue moved to a column
Conditions: issuetype = "Conta Cliente"
Actions: Set field "Ciclo da Conta" = [valor correspondente]
```

---

### 2. Criar Linked Issue - Auto-criar Interação

**Objetivo**: Quando criam nova Interação, confirmar link ao Cliente

**Tipo**: Rule (Jira Automation)

**Trigger**: Issue created [type = Interação]

**Ação**: 
```
1. Prompt para selecionar Cliente
2. Link Interação → Cliente (relates to)
3. Comment: "Linkedado a Cliente: [key]"
```

**Configuração Jira**:
```
Rule name: Auto-link Interação ao Cliente
Trigger: Issue created with type = "Interação"
Conditions: 
  - Project = CSM
  - Type = Interação
Actions: 
  - Link to issue (manual selection)
  - Add comment: "Linkedado"
```

---

### 3. Alerta - Cliente em Risco

**Objetivo**: Notificar gerente quando Cliente vai para "Risco"

**Tipo**: Rule (Jira Automation)

**Trigger**: Field "Ciclo da Conta" changed to "Risco"

**Ação**:
```
1. Notificar Gerente CS via Email/Slack
2. Adicionar label "alert-risk"
3. Set priority = High
```

**Configuração Jira**:
```
Rule name: Alert - Cliente Risco
Trigger: Field "Ciclo da Conta" = "Risco"
Conditions:
  - issuetype = "Conta Cliente"
Actions:
  - Send email to: [Gerente CS]
  - Add label: alert-risk
  - Set Priority: High
```

---

### 4. Verificação - Renovação Próxima

**Objetivo**: 30 dias antes da renovação, criar issue de Renovação

**Tipo**: Scheduled Rule (Jira Automation)

**Trigger**: Scheduled (diariamente)

**Condição**:
```
Data de renovação = hoje + 30 dias
AND NOT EXISTS Renovação linkedada
```

**Ação**:
```
1. Criar issue tipo "Renovação"
2. Link a Cliente (relates to)
3. Notificar CS Manager
```

**Configuração Jira**:
```
Rule name: Create Renovação Issue (30 dias antes)
Trigger: Scheduled (Daily at 8 AM)
Conditions:
  - issuetype = "Conta Cliente"
  - "Data de renovação" = startOfDay("+30d")
  - NOT linkedIssue in (type = "Renovação")
Actions:
  - Create issue (type: Renovação)
  - Link to current issue
  - Notify: Project Lead
```

---

### 5. Auditoria - Ciclo da Conta Vazio

**Objetivo**: Garantir que todo Cliente tem "Ciclo da Conta" definido

**Tipo**: Scheduled Rule (semanal)

**Trigger**: Scheduled (toda segunda-feira)

**Condição**:
```
issuetype = "Conta Cliente"
AND "Ciclo da Conta" is EMPTY
```

**Ação**:
```
1. Adicionar comentário: "Ciclo da Conta não definido"
2. Notificar reporter
3. Add label: "audit-missing-cycle"
```

**Configuração Jira**:
```
Rule name: Audit - Ciclo da Conta Vazio
Trigger: Scheduled (Weekly, Monday 9 AM)
Conditions:
  - issuetype = "Conta Cliente"
  - "Ciclo da Conta" is EMPTY
Actions:
  - Add comment: "Ciclo da Conta precisa ser definido"
  - Notify: Reporter
  - Add label: audit-missing-cycle
```

---

### 6. Transição - Mover para Churn

**Objetivo**: Quando Cliente atingir "Ciclo = Churn", mover board para "Cancelamento"

**Tipo**: Rule (Jira Automation)

**Trigger**: Field "Ciclo da Conta" changed to "Churn"

**Ação**:
```
1. Mover issue para coluna "Cancelamento"
2. Adicionar commentário com motivo
3. Archive para relatório
```

**Configuração Jira**:
```
Rule name: Auto-move to Cancelamento on Churn
Trigger: Field "Ciclo da Conta" changed to "Churn"
Conditions:
  - issuetype = "Conta Cliente"
  - Current column != "Cancelamento"
Actions:
  - Transition issue to "Cancelamento"
  - Add comment: "Automaticamente movido para Churn"
  - Lock for edits (optional)
```

---

### 7. Synchronização - Renovação Concluída

**Objetivo**: Quando Renovação é marcada como Done, atualizar "Ciclo da Conta" para "Renovado"

**Tipo**: Rule (Jira Automation)

**Trigger**: Issue [type = Renovação] marked as Done

**Ação**:
```
1. Ir ao Cliente linkedado
2. Set Ciclo da Conta = "Renovado"
3. Move Cliente back para "Acompanhamento 1"
```

**Configuração Jira**:
```
Rule name: Auto-update Cliente on Renovação Complete
Trigger: Issue transitioned to Done (type = "Renovação")
Actions:
  - Get linked issue (Cliente)
  - Set field "Ciclo da Conta" = "Renovado"
  - Transition Cliente to "Acompanhamento 1"
```

---

## Automações por Caso de Uso

### Caso de Uso 1: Onboarding de Cliente Novo

**Sequência**:
1. Criar issue tipo "Cliente" (manual ou via form)
2. *Auto-trigger*: Definir Ciclo = Onboarding
3. *Auto-trigger*: Criar Plano de Sucesso linkedado
4. *Manual*: Definir Contato Principal, Data de Lançamento
5. *Auto-trigger*: Quando vai para "Lançamento", Ciclo = Ativo

---

### Caso de Uso 2: Rastreamento de Renovação

**Sequência**:
1. *Auto-trigger (30d antes)*: Criar issue de Renovação
2. *Manual*: Update Renovação com termos/valor
3. *Manual*: Transition Renovação → Done (quando renovado)
4. *Auto-trigger*: Update Cliente - Ciclo = Renovado, Move para Acompanhamento

---

### Caso de Uso 3: Gestão de Riscos

**Sequência**:
1. *Manual*: Criar issue tipo "Risco"
2. *Manual*: Link ao Cliente, definir Probabilidade/Valor
3. *Manual*: Set Cliente - Ciclo = Risco
4. *Auto-trigger*: Notificação ao Gerente
5. *Manual*: Criar Plano de Sucesso para mitigação

---

### Caso de Uso 4: Rastreamento de Interações

**Sequência**:
1. *Manual*: Criar issue tipo "Interação"
2. *Manual*: Link ao Cliente
3. *Auto-trigger*: Confirmar link com comentário
4. *Manual*: Update Sentimento, Próximos Passos

---

## Configuração Passo a Passo

### Acessar Jira Automation

1. Projeto CSM → Project Settings
2. Automation (menu lateral)
3. "Create rule" → Choose trigger

### Exemplo: Regra de Alerta Risco

**Trigger**: Field Changed
- Field: Ciclo da Conta
- To Value: Risco

**Conditions**: 
- Issue type is Cliente

**Actions**:
- Send email
  - To: [Team]
  - Subject: "Cliente em Risco: {{issue.key}} - {{issue.summary}}"
  - Body: "Ciclo da Conta = Risco. Ação recomendada: revisar health score e plano de mitigação."

**Test** → **Enable**

---

## Considerações de Governance

### Limitações Jira Cloud

- Automação limitada a 100 rules por projeto (plano Standard)
- Sem acesso a Webhook/Custom Scripts (requer Scripts for Jira - add-on pago)
- Scheduled rules com limite de frequência (máx 1x dia para muitos tipos)

### Alternativas para Automações Complexas

Para automações além de Jira Automation nativo:

1. **Scripts for Jira** (paid add-on)
   - Acesso a APIs da plataforma
   - Automações em JavaScript
   - Exemplo: Sincronizar com sistemas externos

2. **Zapier/Integromat**
   - Conectar Jira a ferramentas externas
   - Exemplo: Notificação Slack, criar eventos no Calendar

3. **Webhook + Backend Custom**
   - Usar Jira Webhooks para triggar aplicação própria
   - Maior flexibilidade e controle

---

## Monitoramento de Automações

### Verificar Execução

1. Project Settings → Automation
2. Clique em rule → "Executions"
3. Veja histórico: success/failed

### Troubleshooting

- **Regra não executou**: Verificar conditions match
- **Erro ao executar**: Revisar field names, formatos
- **Performance**: Considerar agendar em horários off-peak

---

## Roadmap de Implementação

### Fase 1 (Semana 1): Setup Básico
- [x] Rule 1: Auto-sync Ciclo com Board
- [x] Rule 2: Auto-link Interação
- [x] Rule 3: Alerta Risco

### Fase 2 (Semana 2-3): Renovações & Auditorias
- [ ] Rule 4: Verificação Renovação 30d
- [ ] Rule 5: Auditoria Ciclo Vazio
- [ ] Rule 6: Auto-move Churn

### Fase 3 (Semana 4+): Otimizações
- [ ] Rule 7: Sync Renovação Completa
- [ ] Análise de utilização
- [ ] Refinements baseado em feedback

---

## Exemplos de Regras em JSON

As automações podem ser exportadas/importadas como JSON:

```json
{
  "name": "Auto-sync Ciclo da Conta",
  "trigger": {
    "type": "IssuePropertyChanged",
    "property": "status"
  },
  "conditions": [
    {
      "type": "IssueType",
      "value": "Cliente"
    }
  ],
  "actions": [
    {
      "type": "SetField",
      "field": "customfield_12345",
      "value": "{{trigger.transitionTo}}"
    }
  ]
}
```

Consulte documentação Jira Automation para mais detalhes.

---

## Suporte e Documentação

- **Jira Automation Docs**: https://support.atlassian.com/jira-software-cloud/articles/what-is-automation-for-jira-cloud/
- **Triggers & Actions**: https://support.atlassian.com/jira-automation/
- **Community**: https://community.atlassian.com/t5/Jira-Questions/ct-p/jira-q
