# Preflight Jira CS

- **Modo**: apply
- **Início**: 2026-03-12T13:40:13.183Z
- **Fim**: 2026-03-12T13:40:23.597Z
- **Status geral**: rejected

## Resumo executivo

- **Pode seguir para apply?** Não
- **Passes**: 119
- **Warnings**: 14
- **Falhas**: 2
- **Falhas bloqueantes**: 2

### Principais bloqueios

- **Campo select sem opções configuradas** (config:field-select-no-options:account.segment) - Campo select "Segmento" não possui opções definidas.
- **Campo select sem opções configuradas** (config:field-select-no-options:account.product) - Campo select "Produto" não possui opções definidas.

### Principais warnings

- **Diretório de templates de tickets** (config:templates-dir-missing) - Diretório src/templates/ticketDescriptions não encontrado. Templates de descrição serão documentados apenas em texto.
- **Dependência de projectId para campos/contextos** (dep:fields-projectid) - Campos customizados e contextos dependem de um projectId real em tempo de execução. Se o projeto não existir, estes passos serão marcados como manuais.
- **Validação de JQL para filtro "CSM - Board base"** (jql:boardBase) - Erro ao validar JQL para filtro "CSM - Board base".
- **Validação de JQL para filtro "CSM - Clientes em risco"** (jql:clientsAtRisk) - Erro ao validar JQL para filtro "CSM - Clientes em risco".
- **Validação de JQL para filtro "CSM - Renovações próximas"** (jql:upcomingRenewals) - Erro ao validar JQL para filtro "CSM - Renovações próximas".
- **Validação de JQL para filtro "CSM - Clientes sem interação recente"** (jql:noRecentInteractions) - Erro ao validar JQL para filtro "CSM - Clientes sem interação recente".
- **Validação de JQL para filtro "CSM - Oportunidades em aberto"** (jql:openOpportunities) - Erro ao validar JQL para filtro "CSM - Oportunidades em aberto".
- **Validação de JQL para filtro "CSM - Contas por estágio do lifecycle"** (jql:accountsByLifecycle) - Erro ao validar JQL para filtro "CSM - Contas por estágio do lifecycle".
- **Validação de JQL para filtro "CSM - Contas ativas"** (jql:activeAccounts) - Erro ao validar JQL para filtro "CSM - Contas ativas".
- **Validação de JQL para filtro "CSM - Contas churnadas"** (jql:churnedAccounts) - Erro ao validar JQL para filtro "CSM - Contas churnadas".
- ... e mais 4 warnings.

### Próxima ação recomendada

- Corrija as falhas bloqueantes listadas acima (env, autenticação, endpoints críticos, configurações essenciais, JQL inválida) e execute o preflight novamente antes de tentar `apply`.

## Checks detalhados

| Key | Título | Status | Severidade | Blocking | Mensagem |
| --- | ------ | ------ | ---------- | -------- | -------- |
| env:jira_base_url | Variável de ambiente obrigatória: JIRA_BASE_URL | pass | info | não | JIRA_BASE_URL está definida. |
| env:jira_email | Variável de ambiente obrigatória: JIRA_EMAIL | pass | info | não | JIRA_EMAIL está definida. |
| env:jira_api_token | Variável de ambiente obrigatória: JIRA_API_TOKEN | pass | info | não | JIRA_API_TOKEN está definida. |
| env:jira_project_key | Variável de ambiente obrigatória: JIRA_PROJECT_KEY | pass | info | não | JIRA_PROJECT_KEY está definida. |
| env:jira_project_name | Variável de ambiente obrigatória: JIRA_PROJECT_NAME | pass | info | não | JIRA_PROJECT_NAME está definida. |
| env:project-template | Configuração de template de projeto | pass | info | não | Template de projeto configurado (business / com.atlassian.jira-core-project-templates:jira-core-project-management). |
| env:project-lead | Project lead account id | pass | info | não | JIRA_PROJECT_LEAD_ACCOUNT_ID configurado. |
| env:project-key-format | Formato da project key | pass | info | não | JIRA_PROJECT_KEY parece válido para Jira (apenas letras maiúsculas e dígitos, iniciando com letra). |
| config:issuetypes-load | Carregamento de configuração de issue types | pass | info | não | Foram carregados 7 issue types lógicos. |
| config:fields-load | Carregamento de configuração de campos | pass | info | não | Foram carregados 38 campos lógicos. |
| config:filters-load | Carregamento de configuração de filtros | pass | info | não | Foram carregados 9 filtros configurados. |
| config:dashboards-load | Carregamento de configuração de dashboards | pass | info | não | Foram carregados 3 dashboards configurados. |
| auth:myself | Validação de autenticação (GET /myself) | pass | info | não | Autenticação OK. Usuário: Emmanuelle Barbosa (712020:33175fac-dd20-48c0-ad33-15128aea86ba). |
| endpoint:myself | Endpoint /rest/api/3/myself | pass | info | não | Endpoint respondeu com status 200. |
| endpoint:issuetype | Endpoint /rest/api/3/issuetype | pass | info | não | Endpoint respondeu com status 200. |
| endpoint:field | Endpoint /rest/api/3/field | pass | info | não | Endpoint respondeu com status 200. |
| endpoint:filter-search | Endpoint /rest/api/3/filter/search | pass | info | não | Endpoint respondeu com status 200. |
| endpoint:dashboard | Endpoint /rest/api/3/dashboard | pass | info | não | Endpoint respondeu com status 200. |
| endpoint:agile-board | Endpoint /rest/agile/1.0/board | pass | info | não | Endpoint respondeu com status 200. |
| perm:administer | Permissão Administrar Jira (global) | pass | info | não | Permissão aparenta estar disponível para o usuário autenticado. |
| perm:administer_projects | Permissão Administrar projetos | pass | info | não | Permissão aparenta estar disponível para o usuário autenticado. |
| perm:browse_projects | Permissão Visualizar projetos | pass | info | não | Permissão aparenta estar disponível para o usuário autenticado. |
| perm:create_issues | Permissão Criar issues | pass | info | não | Permissão aparenta estar disponível para o usuário autenticado. |
| perm:manage_sprints_permission | Permissão Gerenciar boards/sprints | pass | info | não | Permissão aparenta estar disponível para o usuário autenticado. |
| config:field-select-no-options:account.segment | Campo select sem opções configuradas | fail | high | sim | Campo select "Segmento" não possui opções definidas. |
| config:field-select-no-options:account.product | Campo select sem opções configuradas | fail | high | sim | Campo select "Produto" não possui opções definidas. |
| config:templates-dir-missing | Diretório de templates de tickets | warn | low | não | Diretório src/templates/ticketDescriptions não encontrado. Templates de descrição serão documentados apenas em texto. |
| dep:board-base-filter | Filtro base para board Kanban | pass | info | não | Filtro base identificado: CSM - Board base. |
| dep:fields-projectid | Dependência de projectId para campos/contextos | warn | low | não | Campos customizados e contextos dependem de um projectId real em tempo de execução. Se o projeto não existir, estes passos serão marcados como manuais. |
| jql:boardBase | Validação de JQL para filtro "CSM - Board base" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Board base". |
| jql:clientsAtRisk | Validação de JQL para filtro "CSM - Clientes em risco" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Clientes em risco". |
| jql:upcomingRenewals | Validação de JQL para filtro "CSM - Renovações próximas" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Renovações próximas". |
| jql:noRecentInteractions | Validação de JQL para filtro "CSM - Clientes sem interação recente" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Clientes sem interação recente". |
| jql:openOpportunities | Validação de JQL para filtro "CSM - Oportunidades em aberto" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Oportunidades em aberto". |
| jql:accountsByLifecycle | Validação de JQL para filtro "CSM - Contas por estágio do lifecycle" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Contas por estágio do lifecycle". |
| jql:activeAccounts | Validação de JQL para filtro "CSM - Contas ativas" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Contas ativas". |
| jql:churnedAccounts | Validação de JQL para filtro "CSM - Contas churnadas" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Contas churnadas". |
| jql:interactionsThisMonth | Validação de JQL para filtro "CSM - Interações do mês" | warn | medium | não | Erro ao validar JQL para filtro "CSM - Interações do mês". |
| fieldmodel:account.segment | Validação de modelo de campo "Segmento" | warn | low | não | Campo select "Segmento" não possui opções definidas (ver configCheck). |
| fieldmodel:account.userCount | Validação de modelo de campo "Quantidade de usuários" | pass | info | não | Campo "Quantidade de usuários" com tipo lógico "number". |
| fieldmodel:account.mrr | Validação de modelo de campo "MRR" | pass | info | não | Campo "MRR" com tipo lógico "number". |
| fieldmodel:account.healthScore | Validação de modelo de campo "Health Score" | pass | info | não | Campo "Health Score" com tipo lógico "number". |
| fieldmodel:account.nps | Validação de modelo de campo "NPS" | pass | info | não | Campo "NPS" com tipo lógico "number". |
| fieldmodel:account.status | Validação de modelo de campo "Status da conta" | pass | info | não | Campo "Status da conta" com tipo lógico "select". |
| fieldmodel:account.engagement | Validação de modelo de campo "Engajamento da plataforma" | pass | info | não | Campo "Engajamento da plataforma" com tipo lógico "select". |
| fieldmodel:account.csParticipation | Validação de modelo de campo "Participação CS" | pass | info | não | Campo "Participação CS" com tipo lógico "select". |
| fieldmodel:account.advocacyProgram | Validação de modelo de campo "Participa do programa de Advocacy" | pass | info | não | Campo "Participa do programa de Advocacy" com tipo lógico "select". |
| fieldmodel:account.renewalDate | Validação de modelo de campo "Data de renovação" | pass | info | não | Campo "Data de renovação" com tipo lógico "date". |
| fieldmodel:account.product | Validação de modelo de campo "Produto" | warn | low | não | Campo select "Produto" não possui opções definidas (ver configCheck). |
| fieldmodel:account.journeyStartDate | Validação de modelo de campo "Data de início da jornada" | pass | info | não | Campo "Data de início da jornada" com tipo lógico "date". |
| fieldmodel:account.launchDate | Validação de modelo de campo "Data do lançamento" | pass | info | não | Campo "Data do lançamento" com tipo lógico "date". |
| fieldmodel:account.trainingDate | Validação de modelo de campo "Data do treinamento" | pass | info | não | Campo "Data do treinamento" com tipo lógico "date". |
| fieldmodel:account.contractDuration | Validação de modelo de campo "Duração do contrato" | pass | info | não | Campo "Duração do contrato" com tipo lógico "text". |
| fieldmodel:account.notes | Validação de modelo de campo "Observações da conta" | pass | info | não | Campo "Observações da conta" com tipo lógico "paragraph". |
| fieldmodel:primaryContact.name | Validação de modelo de campo "Nome do contato principal" | pass | info | não | Campo "Nome do contato principal" com tipo lógico "text". |
| fieldmodel:primaryContact.email | Validação de modelo de campo "Email do contato principal" | pass | info | não | Campo "Email do contato principal" com tipo lógico "text". |
| fieldmodel:primaryContact.phone | Validação de modelo de campo "Telefone do contato principal" | pass | info | não | Campo "Telefone do contato principal" com tipo lógico "text". |
| fieldmodel:primaryContact.role | Validação de modelo de campo "Cargo do contato principal" | pass | info | não | Campo "Cargo do contato principal" com tipo lógico "text". |
| fieldmodel:primaryContact.area | Validação de modelo de campo "Área do contato principal" | pass | info | não | Campo "Área do contato principal" com tipo lógico "text". |
| fieldmodel:interaction.type | Validação de modelo de campo "Tipo de interação" | pass | info | não | Campo "Tipo de interação" com tipo lógico "select". |
| fieldmodel:interaction.date | Validação de modelo de campo "Data da interação" | pass | info | não | Campo "Data da interação" com tipo lógico "date". |
| fieldmodel:interaction.summary | Validação de modelo de campo "Resumo da interação" | pass | info | não | Campo "Resumo da interação" com tipo lógico "paragraph". |
| fieldmodel:interaction.insight | Validação de modelo de campo "Insight coletado" | pass | info | não | Campo "Insight coletado" com tipo lógico "paragraph". |
| fieldmodel:interaction.sentiment | Validação de modelo de campo "Sentimento do cliente" | pass | info | não | Campo "Sentimento do cliente" com tipo lógico "select". |
| fieldmodel:interaction.nextSteps | Validação de modelo de campo "Próximos passos" | pass | info | não | Campo "Próximos passos" com tipo lógico "paragraph". |
| fieldmodel:successPlan.goal | Validação de modelo de campo "Objetivo da ação" | pass | info | não | Campo "Objetivo da ação" com tipo lógico "paragraph". |
| fieldmodel:successPlan.actionType | Validação de modelo de campo "Tipo de ação" | pass | info | não | Campo "Tipo de ação" com tipo lógico "select". |
| fieldmodel:successPlan.priority | Validação de modelo de campo "Prioridade" | pass | info | não | Campo "Prioridade" com tipo lógico "select". |
| fieldmodel:successPlan.dueDate | Validação de modelo de campo "Prazo" | pass | info | não | Campo "Prazo" com tipo lógico "date". |
| fieldmodel:successPlan.owner | Validação de modelo de campo "Responsável da ação" | warn | low | não | Campo userPicker pode ter limitações de configuração por API; confirme manualmente o comportamento desejado. |
| fieldmodel:successPlan.metric | Validação de modelo de campo "Métrica de sucesso" | pass | info | não | Campo "Métrica de sucesso" com tipo lógico "paragraph". |
| fieldmodel:risk.type | Validação de modelo de campo "Tipo de registro" | pass | info | não | Campo "Tipo de registro" com tipo lógico "select". |
| fieldmodel:risk.probability | Validação de modelo de campo "Probabilidade" | pass | info | não | Campo "Probabilidade" com tipo lógico "select". |
| fieldmodel:risk.estimatedValue | Validação de modelo de campo "Valor estimado" | pass | info | não | Campo "Valor estimado" com tipo lógico "number". |
| fieldmodel:risk.reason | Validação de modelo de campo "Motivo" | pass | info | não | Campo "Motivo" com tipo lógico "paragraph". |
| fieldmodel:risk.actionPlan | Validação de modelo de campo "Plano de ação" | pass | info | não | Campo "Plano de ação" com tipo lógico "paragraph". |
| sim:project | Simulação de projeto | pass | info | não | Projeto já existe e seria reutilizado (would_reuse). |
| sim:issuetype:account | Simulação de issue type "Conta Cliente" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:interaction | Simulação de issue type "Interação" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:successPlan | Simulação de issue type "Plano de Sucesso" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:risk | Simulação de issue type "Risco" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:opportunity | Simulação de issue type "Oportunidade CS" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:renewal | Simulação de issue type "Renovação" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:issuetype:onboardingTask | Simulação de issue type "Onboarding Task" | pass | info | não | Issue type não existe e seria criado (would_create) ou mapeado para fallback, conforme config. |
| sim:field:account.segment | Simulação de campo "Segmento" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.userCount | Simulação de campo "Quantidade de usuários" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.mrr | Simulação de campo "MRR" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.healthScore | Simulação de campo "Health Score" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.nps | Simulação de campo "NPS" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.status | Simulação de campo "Status da conta" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.engagement | Simulação de campo "Engajamento da plataforma" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.csParticipation | Simulação de campo "Participação CS" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.advocacyProgram | Simulação de campo "Participa do programa de Advocacy" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.renewalDate | Simulação de campo "Data de renovação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.product | Simulação de campo "Produto" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.journeyStartDate | Simulação de campo "Data de início da jornada" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.launchDate | Simulação de campo "Data do lançamento" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.trainingDate | Simulação de campo "Data do treinamento" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.contractDuration | Simulação de campo "Duração do contrato" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:account.notes | Simulação de campo "Observações da conta" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:primaryContact.name | Simulação de campo "Nome do contato principal" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:primaryContact.email | Simulação de campo "Email do contato principal" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:primaryContact.phone | Simulação de campo "Telefone do contato principal" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:primaryContact.role | Simulação de campo "Cargo do contato principal" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:primaryContact.area | Simulação de campo "Área do contato principal" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.type | Simulação de campo "Tipo de interação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.date | Simulação de campo "Data da interação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.summary | Simulação de campo "Resumo da interação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.insight | Simulação de campo "Insight coletado" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.sentiment | Simulação de campo "Sentimento do cliente" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:interaction.nextSteps | Simulação de campo "Próximos passos" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:successPlan.goal | Simulação de campo "Objetivo da ação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:successPlan.actionType | Simulação de campo "Tipo de ação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:successPlan.priority | Simulação de campo "Prioridade" | pass | info | não | Campo já existe e seria reutilizado (would_reuse). |
| sim:field:successPlan.dueDate | Simulação de campo "Prazo" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:successPlan.owner | Simulação de campo "Responsável da ação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:successPlan.metric | Simulação de campo "Métrica de sucesso" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:risk.type | Simulação de campo "Tipo de registro" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:risk.probability | Simulação de campo "Probabilidade" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:risk.estimatedValue | Simulação de campo "Valor estimado" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:risk.reason | Simulação de campo "Motivo" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:field:risk.actionPlan | Simulação de campo "Plano de ação" | pass | medium | não | Campo não existe e seria criado (would_create), com contexto e opções criados conforme necessário. |
| sim:filter:boardBase | Simulação de filtro "CSM - Board base" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:clientsAtRisk | Simulação de filtro "CSM - Clientes em risco" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:upcomingRenewals | Simulação de filtro "CSM - Renovações próximas" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:noRecentInteractions | Simulação de filtro "CSM - Clientes sem interação recente" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:openOpportunities | Simulação de filtro "CSM - Oportunidades em aberto" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:accountsByLifecycle | Simulação de filtro "CSM - Contas por estágio do lifecycle" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:activeAccounts | Simulação de filtro "CSM - Contas ativas" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:churnedAccounts | Simulação de filtro "CSM - Contas churnadas" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:filter:interactionsThisMonth | Simulação de filtro "CSM - Interações do mês" | pass | info | não | Filtro não existe e seria criado (would_create). |
| sim:board | Simulação de board Kanban | pass | medium | não | Board não existe e seria criado (would_create), usando filtro base configurado. |
| sim:dashboard:health | Simulação de dashboard "CSM - Saúde da base" | pass | info | não | Dashboard não existe e seria criado (would_create). |
| sim:dashboard:relationship | Simulação de dashboard "CSM - Relacionamento" | pass | info | não | Dashboard não existe e seria criado (would_create). |
| sim:dashboard:growth | Simulação de dashboard "CSM - Crescimento" | pass | info | não | Dashboard não existe e seria criado (would_create). |

