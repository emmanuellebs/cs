/**
 * Cria regras de Automation no Jira Cloud via Automation Rule Management API.
 *
 * Pré-requisitos:
 * - .env deve conter:
 *   JIRA_AUTOMATION_TOKEN= <Bearer OAuth2 token com scope manage:jira-project, manage:automation>
 *   JIRA_CLOUD_ID= <cloudid do site> (ex.: GET https://api.atlassian.com/oauth/token/accessible-resources)
 *   JIRA_PROJECT_KEY= CSM
 *   JIRA_PROJECT_ID= 10173
 *   JIRA_ACTOR_ACCOUNT_ID= <accountId do ator das regras>
 *
 * Observação: JIRA_API_TOKEN (básico) NÃO funciona neste endpoint; é necessário bearer OAuth.
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

type RuleComponent = Record<string, unknown>;

interface RuleDefinition {
  name: string;
  description: string;
  trigger: RuleComponent;
  components: RuleComponent[];
}

const {
  JIRA_AUTOMATION_TOKEN,
  JIRA_CLOUD_ID,
  JIRA_PROJECT_KEY,
  JIRA_PROJECT_ID,
  JIRA_ACTOR_ACCOUNT_ID,
} = process.env;

function envOrThrow(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Env var ${name} ausente. Configure no .env antes de rodar.`);
  }
  return value;
}

const cloudId = envOrThrow('JIRA_CLOUD_ID', JIRA_CLOUD_ID!);
const projectKey = envOrThrow('JIRA_PROJECT_KEY', JIRA_PROJECT_KEY!);
const projectId = envOrThrow('JIRA_PROJECT_ID', JIRA_PROJECT_ID!);
const actorId = envOrThrow('JIRA_ACTOR_ACCOUNT_ID', JIRA_ACTOR_ACCOUNT_ID!);
const token = envOrThrow('JIRA_AUTOMATION_TOKEN', JIRA_AUTOMATION_TOKEN!);

const api = axios.create({
  baseURL: `https://api.atlassian.com/automation/public/jira/${cloudId}/rest/v1`,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Helpers para componentes
const scheduled = (cron: string): RuleComponent => ({
  component: 'TRIGGER',
  type: 'SCHEDULED',
  schemaVersion: 2154,
  value: JSON.stringify({ type: 'CRON_EXPRESSION', value: cron }),
});

const issueUpdated = (): RuleComponent => ({
  component: 'TRIGGER',
  type: 'ISSUE_UPDATED',
  schemaVersion: 2154,
});

const jqlCondition = (jql: string): RuleComponent => ({
  component: 'CONDITION',
  type: 'JQL',
  schemaVersion: 2154,
  value: jql,
});

const createIssue = (issuetypeName: string, summary: string, description?: string): RuleComponent => ({
  component: 'ACTION',
  type: 'CREATE_ISSUE',
  schemaVersion: 2154,
  value: JSON.stringify({
    fields: {
      project: { key: projectKey },
      issuetype: { name: issuetypeName },
      summary,
      description: description ?? '',
    },
    linkType: 'Relates',
  }),
});

const addComment = (comment: string): RuleComponent => ({
  component: 'ACTION',
  type: 'COMMENT',
  schemaVersion: 2154,
  value: JSON.stringify({ comment }),
});

const lookupIssues = (jql: string): RuleComponent => ({
  component: 'ACTION',
  type: 'LOOKUP_ISSUES',
  schemaVersion: 2154,
  value: JSON.stringify({ jql }),
});

const ifCondition = (smartValue: string, condition: string, children: RuleComponent[]): RuleComponent => ({
  component: 'CONDITION',
  type: 'ADVANCE_COMPARE',
  schemaVersion: 2154,
  value: JSON.stringify({
    firstValue: smartValue,
    operator: condition, // e.g., "lessThan", "greaterThan"
    secondValue: '',
  }),
  children,
});

const rules: RuleDefinition[] = [
  {
    name: 'Alerta Renovação 90/60/30',
    description: 'Cria alerta e issue de renovação para Clientes nos próximos 90/60/30 dias',
    trigger: scheduled('0 0 3 * * ?'),
    components: [
      jqlCondition(
        `project = ${projectKey} AND issuetype = "Cliente" AND "Data de renovação" >= startOfDay() AND "Data de renovação" <= endOfDay("+90d")`
      ),
      addComment('Renovação em 90/60/30 dias – verifique prazos e proposta.'),
      createIssue(
        'Renovação',
        'Renovação em {{issue.fields."Data de renovação".toDate}} - {{issue.key}}',
        'Criada automaticamente pela regra de 90/60/30 dias.'
      ),
    ],
  },
  {
    name: 'Health Score abaixo da meta',
    description: 'Cria Risco quando Health Score < 80',
    trigger: issueUpdated(),
    components: [
      jqlCondition(`project = ${projectKey} AND issuetype = Cliente AND "Health Score" < 80`),
      createIssue(
        'Risco',
        'Health Score baixo - {{issue.key}}',
        'HS abaixo de 80; revisar plano de sucesso.'
      ),
      addComment('⚠ Health Score abaixo de 80. Abrindo risco para acompanhamento.'),
    ],
  },
  {
    name: 'NPS abaixo de 50',
    description: 'Cria Risco quando NPS < 50',
    trigger: issueUpdated(),
    components: [
      jqlCondition(`project = ${projectKey} AND issuetype = Cliente AND NPS < 50`),
      createIssue('Risco', 'NPS baixo - {{issue.key}}', 'NPS < 50; ação de recuperação.'),
      addComment('⚠ NPS abaixo de 50. Registrar ação de recuperação.'),
    ],
  },
  {
    name: 'Reuniões mensais com Cliente (meta 8/mês)',
    description: 'Gera interação de reunião quando meta mensal não atingida',
    trigger: scheduled('0 0 4 * * ?'), // diário às 04:00
    components: [
      lookupIssues(
        `project = ${projectKey} AND issuetype = "Interação" AND "Tipo de interação" = "Reunião" AND updated >= startOfMonth()`
      ),
      // Simples: se lookupIssues vazio, cria interação. (Automations avançadas podem usar smart-value para contagem.)
      createIssue(
        'Interação',
        'Agendar reunião de acompanhamento - {{issue.key}}',
        'Meta de 8 reuniões/mês não atingida; gerar ação.'
      ),
      addComment('Agendar reunião para cumprir meta mensal de reuniões.'),
    ],
  },
  {
    name: 'Churn marcado',
    description: 'Sinaliza churn quando Ciclo da Conta = Churn',
    trigger: issueUpdated(),
    components: [
      jqlCondition(`project = ${projectKey} AND issuetype = Cliente AND "Ciclo da Conta" = Churn`),
      createIssue('Risco', 'Churn marcado - {{issue.key}}', 'Conta marcada como Churn.'),
      addComment('Conta marcada como Churn – registrar causa e ação.'),
    ],
  },
  {
    name: 'Advocacy Rate',
    description: 'Cria Oportunidade quando cliente entra no programa de Advocacy',
    trigger: issueUpdated(),
    components: [
      jqlCondition(
        `project = ${projectKey} AND issuetype = Cliente AND "Participa do programa de Advocacy" = Sim`
      ),
      createIssue('Oportunidade', 'Advocacy - {{issue.key}}', 'Cliente elegível para advocacy.'),
      addComment('Cliente marcado como Advocacy; avaliar case/participação.'),
    ],
  },
  {
    name: 'Engajamento Baixo',
    description: 'Cria Interação de recuperação quando engajamento = Baixo',
    trigger: issueUpdated(),
    components: [
      jqlCondition(`project = ${projectKey} AND issuetype = Cliente AND "Engajamento da plataforma" = Baixo`),
      createIssue(
        'Interação',
        'Recuperar engajamento - {{issue.key}}',
        'Gerar reunião de recuperação de engajamento.'
      ),
      addComment('Engajamento Baixo – abrir sessão de sucesso / treinamento.'),
    ],
  },
];

async function createRule(def: RuleDefinition) {
  const body = {
    rule: {
      name: def.name,
      description: def.description,
      state: 'ENABLED',
      ruleScopeARIs: [`ari:cloud:jira:${cloudId}:project/${projectId}`],
      actor: { actor: actorId, type: 'ACCOUNT_ID' },
      trigger: def.trigger,
      components: def.components,
    },
  };
  const resp = await api.post('/rule', body);
  return resp.data;
}

async function main() {
  console.info('Criando regras de Automation...');
  for (const rule of rules) {
    try {
      const result = await createRule(rule);
      console.info(`✓ Criada: ${rule.name} (${result?.uuid ?? 'sem uuid retornado'})`);
    } catch (err: any) {
      const status = err?.response?.status;
      console.error(`Erro ao criar regra "${rule.name}" (status ${status}):`, err?.response?.data || err.message);
    }
  }
}

main().catch((err) => {
  console.error('Falha inesperada', err);
  process.exitCode = 1;
});
