import dotenv from 'dotenv';
import { rootLogger } from '../utils/logger';

dotenv.config();

export interface JiraEnvConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  projectName: string;
  projectLeadAccountId: string | null;
  defaultAssigneeAccountId: string | null;
}

function normalizeBaseUrl(raw?: string): string {
  if (!raw) {
    throw new Error('JIRA_BASE_URL não definido.');
  }

  try {
    const url = new URL(raw);
    // Usar apenas origem (https://dominio.atlassian.net)
    const base = `${url.protocol}//${url.host}`;
    if (url.pathname && url.pathname !== '/' && url.pathname !== '') {
      rootLogger.warn(
        `JIRA_BASE_URL contém caminho (${url.pathname}). Usando apenas a origem ${base} para chamadas REST.`
      );
    }
    return base;
  } catch {
    rootLogger.warn(
      `JIRA_BASE_URL parece não ser uma URL completa. Tentando usar valor bruto: ${raw}`
    );
    return raw.replace(/\/+$/, '');
  }
}

export function loadJiraEnvConfig(): JiraEnvConfig {
  const baseUrl = normalizeBaseUrl(process.env.JIRA_BASE_URL);
  const email = process.env.JIRA_EMAIL || '';
  const apiToken = process.env.JIRA_API_TOKEN || '';
  const projectKey = process.env.JIRA_PROJECT_KEY || '';
  const projectName = process.env.JIRA_PROJECT_NAME || '';
  const projectLeadAccountId = process.env.JIRA_PROJECT_LEAD_ACCOUNT_ID || '';
  const defaultAssigneeAccountId = process.env.DEFAULT_ASSIGNEE_ACCOUNT_ID || '';

  if (!email || !apiToken) {
    throw new Error('JIRA_EMAIL e/ou JIRA_API_TOKEN não configurados.');
  }

  if (!projectKey || !projectName) {
    throw new Error('JIRA_PROJECT_KEY e JIRA_PROJECT_NAME são obrigatórios.');
  }

  return {
    baseUrl,
    email,
    apiToken,
    projectKey,
    projectName,
    projectLeadAccountId: projectLeadAccountId || null,
    defaultAssigneeAccountId: defaultAssigneeAccountId || null,
  };
}

