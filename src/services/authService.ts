import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';

const logger = new Logger({ module: 'authService' });

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
}

export async function validateAuthentication(): Promise<JiraUser> {
  logger.info('Validando autenticação no Jira (GET /myself)...');
  const response = await jiraClient.request<JiraUser>({
    url: '/myself',
    method: 'GET',
  });
  const user = response.data;
  logger.info(`Autenticação OK. Usuário: ${user.displayName} (${user.accountId})`);
  return user;
}

