## jira-cs-provisioning

Provisionador de projeto Jira Cloud para Customer Success (CS), com foco em:

- **Criação e/ou reaproveitamento de projeto Jira para CS**
- **Criação/mapeamento de issue types de CS**
- **Criação de campos customizados, contextos e opções**
- **Criação de filtros JQL, boards e dashboards base**
- **Geração de documentação de passos manuais e automações**
- **Camada de preflight/validação robusta antes de qualquer aplicação real**
- **Modos de execução `preflight`, `audit` (somente leitura) e `apply` (aplica mudanças)**

### Requisitos

- Node.js 18+ instalado.
- Acesso de administrador ao Jira Cloud.
- Token de API do Jira Cloud.

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite `.env` com os valores do seu ambiente:

- **JIRA_BASE_URL**: use apenas a raiz, por exemplo `https://seu-dominio.atlassian.net`  
  - Se você colar uma URL de board (por exemplo, `https://.../jira/core/projects/...`), o script irá ignorar o caminho e usar só a origem para as chamadas REST.
- **JIRA_EMAIL** e **JIRA_API_TOKEN**: credenciais da conta que fará as chamadas.
- **JIRA_PROJECT_KEY** e **JIRA_PROJECT_NAME**: chave e nome do projeto CS.
- **JIRA_PROJECT_LEAD_ACCOUNT_ID**: (opcional, recomendado) accountId do líder do projeto.
- **DEFAULT_ASSIGNEE_ACCOUNT_ID**: (opcional) responsável padrão para criação de issues.
- **JIRA_MODE**:
  - `preflight`: executa apenas validações e simulações, sem provisionar nada.
  - `audit`: modo de auditoria (não faz mudanças de escrita, mas executa preflight antes).
  - `apply`: modo de aplicação (executa preflight e só continua se estiver aprovado).
- **JIRA_DRY_RUN**:
  - `true`: loga intenções de escrita mas não envia requisições de escrita.
  - `false`: envia requisições de escrita normalmente (respeitando o modo).

> **Importante:** nunca commitar `.env` com credenciais reais.

### Execução

#### Modo preflight

Executa apenas validações e simulações, sem criar/alterar nada no Jira. Gera um relatório de readiness:

```bash
npm run build
node dist/index.js --mode=preflight
```

ou, em desenvolvimento:

```bash
npm run dev:audit -- --mode=preflight
```

#### Modo audit-only (auditoria)

- Executa automaticamente o **preflight** (gerando `preflight-report.*`).
- Em seguida, faz descoberta do que existe (projeto, issue types, campos, filtros, boards, dashboards) e gera relatórios e documentação, **sem criar/alterar recursos**:

```bash
npm run build
npm run audit
```

Ou diretamente em desenvolvimento:

```bash
npm run dev:audit
```

#### Modo apply (aplicar)

- Executa automaticamente o **preflight** (gerando `preflight-report.*`).
- Avalia o **readiness gate**:
  - Se houver falhas críticas (auth/env/endpoints/config/JQL), o apply é **bloqueado**.
  - Se aprovado (com ou sem warnings), segue para o provisionamento real.
- Cria/atualiza o que for possível, respeitando `JIRA_DRY_RUN`:

```bash
npm run build
npm run start
```

Ou diretamente em desenvolvimento:

```bash
npm run dev:apply
```

### Relatórios e documentação gerados

Após a execução, o projeto gera arquivos em:

- `outputs/preflight-report.json`: relatório estruturado de validação (checks por item, severidade, bloqueios).
- `outputs/preflight-report.md`: visão executiva de readiness (pode seguir para apply, principais bloqueios e warnings, próximos passos).
- `outputs/provisioning-summary.json`: relatório estruturado por recurso (projeto, issue types, campos, contextos, opções, filtros, boards, dashboards, issues exemplo, pendências manuais).
- `outputs/provisioning-summary.md`: resumo legível da execução.
- `docs/MANUAL_STEPS.md`: passos manuais necessários (workflows, colunas do board, associações avançadas de campo, etc.).
- `docs/AUTOMATION_BLUEPRINT.md`: blueprint das regras de automação (renovação, risco de churn, falta de relacionamento, expansão).
- `docs/FIELD_MAPPING.md`: mapeamento de campos criados ou reaproveitados, incluindo contextos e opções de select.
- `docs/JQL_FILTERS.md`: lista de filtros JQL criados/esperados e suas queries.
- `docs/DASHBOARD_SETUP.md`: instruções para criação manual/ajuste de dashboards e gadgets.
- `docs/PROJECT_ARCHITECTURE.md`: visão geral da arquitetura técnica do provisionador.

### Limitações importantes da API do Jira

- **Workflows e transições customizadas**: a API pública atual do Jira Cloud não oferece um fluxo completo e estável para criação/edição de workflows e as respectivas transições. O provisionador **não promete** criar workflows completos; em vez disso:
  - Detecta limitações.
  - Gera um blueprint detalhado em `MANUAL_STEPS.md` com o fluxo recomendado (Onboarding → Ativo → Engajamento → Expansão → Advocacy → Renovação → Renovado, com transições para Risco e Churn).
- **Configuração de colunas do board**: a API não permite configurar de forma robusta todas as colunas x status do Kanban. O script:
  - Cria o board Kanban associado ao projeto.
  - Documenta a configuração manual das colunas em `DASHBOARD_SETUP.md`.
- **Dashboards e gadgets**:
  - O script tenta criar dashboards vazios.
  - A criação de gadgets é documentada em `DASHBOARD_SETUP.md` (tipo de gadget, filtros, objetivo), pois não é suportada integralmente via API pública.

### Próximos passos

- Ajustar as configurações em `src/config` para refletir sua terminologia de CS (nomes de issue types, campos, filtros, dashboards, templates de descrição).
- Executar primeiro em modo `preflight` para validar readiness técnico do ambiente.
- Em seguida, executar em modo `audit` para confirmar mapeamentos sem criar nada.
- Após ajustes, executar em modo `apply` (com `JIRA_DRY_RUN=false`) para aplicar o provisionamento, somente se o preflight estiver aprovado.


