# Blueprint de automações Jira (Customer Success)

Cada regra abaixo deve ser criada manualmente no **Jira Automation**.

## Regra 1 - Renovação 90 dias antes

- **Objetivo**: Antecipar o processo de renovação criando um registro estruturado.
- **Gatilho**: Agendado diariamente.
- **Condição**: 
  - JQL: issues do tipo **Conta Cliente** com campo **Data de renovação** em 90 dias.
- **Ação**:
  - Criar issue do tipo **Renovação** vinculada à conta.
- **Tipo de issue gerado**: Renovação.
- **Observações**: Usar campo de vínculo (ex.: Issue linked) para relacionar com a Conta Cliente.

## Regra 2 - Renovação 60 dias antes

- **Objetivo**: Alertar o CSM de que a renovação está se aproximando.
- **Gatilho**: Agendado diariamente.
- **Condição**:
  - JQL: Contas com Data de renovação em 60 dias.
- **Ação**:
  - Enviar notificação/email para o CSM responsável (assignee da Conta Cliente ou campo dedicado).
- **Tipo de issue gerado**: Não gera issue, apenas alerta.
- **Observações**: Pode usar ação de email ou Slack (se integrado).

## Regra 3 - Renovação 30 dias antes

- **Objetivo**: Exigir uma reunião obrigatória de renovação.
- **Gatilho**: Agendado diariamente.
- **Condição**:
  - JQL: Contas com Data de renovação em 30 dias.
- **Ação**:
  - Criar tarefa (ex.: issue type **Onboarding Task** ou **Task**) para reunião de renovação.
- **Tipo de issue gerado**: Tarefa operacional de renovação.
- **Observações**: Criar subtarefas específicas se necessário.

## Regra 4 - Risco de churn

- **Objetivo**: Abrir um registro formal de risco e plano de recuperação.
- **Gatilho**: Issue updated.
- **Condição**:
  - Health Score < 60 **ou** Sentimento do cliente = Negativo.
- **Ação**:
  - Criar issue do tipo **Risco** vinculada à Conta Cliente.
- **Tipo de issue gerado**: Risco.
- **Observações**: Preencher campos de motivo, probabilidade e plano de ação a partir de templates.

## Regra 5 - Falta de relacionamento

- **Objetivo**: Evitar perda de relacionamento por falta de contato.
- **Gatilho**: Agendado diariamente.
- **Condição**:
  - JQL: Contas sem issues do tipo **Interação** nos últimos 60 dias.
- **Ação**:
  - Criar ação/tarefa de contato para o CSM.
- **Tipo de issue gerado**: Pode ser **Interação** ou **Onboarding Task**.
- **Observações**: Usar comentários automáticos com contexto do último contato.

## Regra 6 - Expansão

- **Objetivo**: Identificar oportunidades de expansão a partir de alto engajamento.
- **Gatilho**: Issue updated ou agendado.
- **Condição**:
  - Engajamento da plataforma = Alto **e/ou** Health Score acima de limiar (ex.: > 80).
- **Ação**:
  - Criar issue do tipo **Oportunidade CS**.
- **Tipo de issue gerado**: Oportunidade CS.
- **Observações**: Pode incluir valor estimado e próxima etapa sugerida.
