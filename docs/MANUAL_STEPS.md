# Passos manuais necessários

Este arquivo consolida itens que não puderam ser totalmente provisionados via API no projeto **CSM - WH-CS Management**.

## Itens com status manual/failed

| Recurso | Nome | Status | Detalhes |
| ------- | ---- | ------ | -------- |
| issuetype:account | Conta Cliente | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:interaction | Interação | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:successPlan | Plano de Sucesso | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:risk | Risco | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:opportunity | Oportunidade CS | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:renewal | Renovação | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| issuetype:onboardingTask | Onboarding Task | manual | Issue type customizado não existe e não pôde ser criado em modo atual. Nenhum fallback padrão encontrado. Criar manualmente. |
| fieldContext:unknown:Contexto CS | Segmento / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Status da conta / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Engajamento da plataforma / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Participação CS / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Participa do programa de Advocacy / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Produto / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Tipo de interação / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Sentimento do cliente / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Tipo de ação / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:priority:Contexto CS | Prioridade / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:unknown:Contexto CS | Tipo de registro / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldContext:unknown:Contexto CS | Probabilidade / Contexto CS | manual | Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente. |
| fieldOption:priority:unknown: | Prioridade /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| board:kanban | CSM - Lifecycle Kanban | manual | Sem filtro base disponível. Crie manualmente um board Kanban com filtro "project = {projectKey}". |

## Workflow recomendado (lifecycle da Conta Cliente)

- **Estados principais**: Onboarding → Ativo → Engajamento → Expansão → Advocacy → Renovação → Renovado
- **Estados adicionais**: Risco, Churn

### Recomendações de configuração manual

- Criar um workflow específico para o issue type **Conta Cliente** com os estados acima.
- Habilitar transições:
  - Onboarding → Ativo
  - Ativo → Engajamento → Expansão → Advocacy
  - Advocacy → Renovação → Renovado
  - De qualquer estado não final para **Risco** e **Churn**, conforme regra de negócio.
- Associar o workflow a um workflow scheme aplicado ao projeto de CS.

## Configuração manual do board Kanban

Após a criação do board Kanban (automática ou manual), configurar as colunas para mapear os estados do workflow:

- **Onboarding** → status: Onboarding
- **Cliente Ativo** → status: Ativo
- **Engajamento** → status: Engajamento
- **Expansão** → status: Expansão
- **Advocacy** → status: Advocacy
- **Renovação** → status: Renovação
- **Clientes Renovados** → status: Renovado
- **Risco** → status: Risco
- **Churn** → status: Churn

