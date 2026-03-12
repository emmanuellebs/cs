import { loadJiraEnvConfig } from '../config/envConfig';
import { loadRuntimeConfig } from '../config/runtimeConfig';
import { writeJsonFile, writeTextFile } from '../utils/fileWriter';
import { Logger } from '../utils/logger';
import {
  PreflightReport,
  PreflightOverallStatus,
  PreflightReportSummary,
  ValidationCheckResult,
  ValidationContext,
} from './types';
import { runEnvironmentCheck } from './checks/environmentCheck';
import { runAuthCheck } from './checks/authCheck';
import { runEndpointCheck } from './checks/endpointCheck';
import { runPermissionCheck } from './checks/permissionCheck';
import { runConfigCheck } from './checks/configCheck';
import { runDependencyCheck } from './checks/dependencyCheck';
import { runJqlCheck } from './checks/jqlCheck';
import { runFieldModelCheck } from './checks/fieldModelCheck';
import { runDrySimulationCheck } from './checks/drySimulationCheck';
import { ExecutionMode } from '../utils/types';

const logger = new Logger({ module: 'preflightRunner' });

export async function runPreflight(mode: ExecutionMode): Promise<PreflightReport> {
  const startedAt = new Date().toISOString();
  logger.info(`Iniciando preflight checks (modo=${mode})...`);

  const env = loadJiraEnvConfig();
  const ctx: ValidationContext = {
    mode,
    env,
  };

  const allChecks: ValidationCheckResult[] = [];

  const append = (list: ValidationCheckResult[]) => {
    allChecks.push(...list);
  };

  // Ordem dos checks
  append(await runEnvironmentCheck(mode));
  append(await runAuthCheck(ctx));
  append(await runEndpointCheck(ctx));
  append(await runPermissionCheck(ctx));
  append(await runConfigCheck());
  append(await runDependencyCheck());
  append(await runJqlCheck());
  append(await runFieldModelCheck());
  append(await runDrySimulationCheck());

  const summary: PreflightReportSummary = {
    passed: allChecks.filter((c) => c.status === 'pass').length,
    warnings: allChecks.filter((c) => c.status === 'warn').length,
    failed: allChecks.filter((c) => c.status === 'fail').length,
    blockingFailures: allChecks.filter((c) => c.status === 'fail' && c.blocking).length,
  };

  let overallStatus: PreflightOverallStatus;
  if (summary.blockingFailures > 0) {
    overallStatus = 'rejected';
  } else if (summary.failed > 0 || summary.warnings > 0) {
    overallStatus = 'approved_with_warnings';
  } else {
    overallStatus = 'approved';
  }

  const finishedAt = new Date().toISOString();

  const report: PreflightReport = {
    startedAt,
    finishedAt,
    mode,
    overallStatus,
    checks: allChecks,
    summary,
  };

  writeJsonFile('outputs/preflight-report.json', report);

  // Markdown
  let md = `# Preflight Jira CS\n\n`;
  md += `- **Modo**: ${mode}\n`;
  md += `- **Início**: ${startedAt}\n`;
  md += `- **Fim**: ${finishedAt}\n`;
  md += `- **Status geral**: ${overallStatus}\n\n`;

  md += `## Resumo executivo\n\n`;
  const canProceed = overallStatus !== 'rejected';
  md += `- **Pode seguir para apply?** ${canProceed ? 'Sim' : 'Não'}\n`;
  md += `- **Passes**: ${summary.passed}\n`;
  md += `- **Warnings**: ${summary.warnings}\n`;
  md += `- **Falhas**: ${summary.failed}\n`;
  md += `- **Falhas bloqueantes**: ${summary.blockingFailures}\n\n`;

  const blocking = allChecks.filter((c) => c.status === 'fail' && c.blocking);
  const warnings = allChecks.filter((c) => c.status === 'warn');

  md += `### Principais bloqueios\n\n`;
  if (!blocking.length) {
    md += 'Nenhum bloqueio crítico identificado.\n\n';
  } else {
    for (const b of blocking) {
      md += `- **${b.title}** (${b.key}) - ${b.message}\n`;
    }
    md += '\n';
  }

  md += `### Principais warnings\n\n`;
  if (!warnings.length) {
    md += 'Nenhum warning relevante identificado.\n\n';
  } else {
    for (const w of warnings.slice(0, 10)) {
      md += `- **${w.title}** (${w.key}) - ${w.message}\n`;
    }
    if (warnings.length > 10) {
      md += `- ... e mais ${warnings.length - 10} warnings.\n`;
    }
    md += '\n';
  }

  md += `### Próxima ação recomendada\n\n`;
  if (!canProceed) {
    md +=
      '- Corrija as falhas bloqueantes listadas acima (env, autenticação, endpoints críticos, configurações essenciais, JQL inválida) e execute o preflight novamente antes de tentar `apply`.\n\n';
  } else if (overallStatus === 'approved_with_warnings') {
    md +=
      '- É possível seguir para `apply`, mas revise os warnings (permissões, dependências, JQLs contextuais, simulação) e ajuste o que for crítico para o seu ambiente.\n\n';
  } else {
    md +=
      '- O ambiente está pronto do ponto de vista técnico para `apply`. Ainda assim, é recomendado revisar o relatório e executar inicialmente em um ambiente de testes.\n\n';
  }

  md += '## Checks detalhados\n\n';
  md += '| Key | Título | Status | Severidade | Blocking | Mensagem |\n';
  md += '| --- | ------ | ------ | ---------- | -------- | -------- |\n';
  for (const c of allChecks) {
    md += `| ${c.key} | ${c.title} | ${c.status} | ${c.severity} | ${
      c.blocking ? 'sim' : 'não'
    } | ${c.message.replace(/\|/g, '\\|')} |\n`;
  }
  md += '\n';

  writeTextFile('outputs/preflight-report.md', md);

  logger.info(
    `Preflight concluído com status geral "${overallStatus}". Veja outputs/preflight-report.* para detalhes.`
  );

  return report;
}

