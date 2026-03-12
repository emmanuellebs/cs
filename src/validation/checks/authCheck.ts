import { validateAuthentication } from '../../services/authService';
import { ValidationCheckResult, ValidationContext } from '../types';

export async function runAuthCheck(ctx: ValidationContext): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];

  try {
    const user = await validateAuthentication();
    results.push({
      key: 'auth:myself',
      title: 'Validação de autenticação (GET /myself)',
      status: 'pass',
      severity: 'info',
      message: `Autenticação OK. Usuário: ${user.displayName} (${user.accountId}).`,
      blocking: false,
      metadata: {
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress,
      },
    });
  } catch (err: any) {
    results.push({
      key: 'auth:myself',
      title: 'Validação de autenticação (GET /myself)',
      status: 'fail',
      severity: 'critical',
      message:
        'Falha ao autenticar no Jira usando /rest/api/3/myself. Verifique URL, email e API token.',
      details: [String(err?.message ?? err)],
      blocking: true,
    });
  }

  return results;
}

