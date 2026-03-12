import { PreflightReport } from './types';

export interface ReadinessEvaluation {
  canProceed: boolean;
  reason?: string;
  blockingChecks: string[];
}

export function evaluateReadiness(report: PreflightReport): ReadinessEvaluation {
  const blocking = report.checks.filter((c) => c.status === 'fail' && c.blocking);

  const authFail = report.checks.find(
    (c) => c.key === 'auth:myself' && c.status === 'fail'
  );
  const envFail = report.checks.find(
    (c) => c.key.startsWith('env:') && c.status === 'fail' && c.blocking
  );
  const endpointCriticalFail = report.checks.find(
    (c) => c.key.startsWith('endpoint:') && c.status === 'fail' && c.blocking
  );
  const configEssentialFail = report.checks.find(
    (c) => c.key.startsWith('config:') && c.status === 'fail' && c.blocking
  );
  const jqlSyntaxFail = report.checks.find(
    (c) => c.key.startsWith('jql:') && c.status === 'fail' && c.blocking
  );

  const hardBlocking = [authFail, envFail, endpointCriticalFail, configEssentialFail, jqlSyntaxFail].filter(
    Boolean
  ) as typeof authFail[];

  if (hardBlocking.length > 0 || report.summary.blockingFailures > 0) {
    return {
      canProceed: false,
      reason:
        'Preflight possui falhas críticas (autenticação, ambiente, endpoints, configuração essencial ou JQL).',
      blockingChecks: hardBlocking.map((c) => c!.key),
    };
  }

  return {
    canProceed: true,
    reason:
      report.overallStatus === 'approved_with_warnings'
        ? 'Preflight aprovado com warnings. Revise os avisos antes de aplicar em produção.'
        : 'Preflight aprovado.',
    blockingChecks: [],
  };
}

