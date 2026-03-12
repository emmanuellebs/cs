"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPreflight = runPreflight;
const envConfig_1 = require("../config/envConfig");
const fileWriter_1 = require("../utils/fileWriter");
const logger_1 = require("../utils/logger");
const environmentCheck_1 = require("./checks/environmentCheck");
const authCheck_1 = require("./checks/authCheck");
const endpointCheck_1 = require("./checks/endpointCheck");
const permissionCheck_1 = require("./checks/permissionCheck");
const configCheck_1 = require("./checks/configCheck");
const dependencyCheck_1 = require("./checks/dependencyCheck");
const jqlCheck_1 = require("./checks/jqlCheck");
const fieldModelCheck_1 = require("./checks/fieldModelCheck");
const drySimulationCheck_1 = require("./checks/drySimulationCheck");
const logger = new logger_1.Logger({ module: 'preflightRunner' });
async function runPreflight(mode) {
    const startedAt = new Date().toISOString();
    logger.info(`Iniciando preflight checks (modo=${mode})...`);
    const env = (0, envConfig_1.loadJiraEnvConfig)();
    const ctx = {
        mode,
        env,
    };
    const allChecks = [];
    const append = (list) => {
        allChecks.push(...list);
    };
    // Ordem dos checks
    append(await (0, environmentCheck_1.runEnvironmentCheck)(mode));
    append(await (0, authCheck_1.runAuthCheck)(ctx));
    append(await (0, endpointCheck_1.runEndpointCheck)(ctx));
    append(await (0, permissionCheck_1.runPermissionCheck)(ctx));
    append(await (0, configCheck_1.runConfigCheck)());
    append(await (0, dependencyCheck_1.runDependencyCheck)());
    append(await (0, jqlCheck_1.runJqlCheck)());
    append(await (0, fieldModelCheck_1.runFieldModelCheck)());
    append(await (0, drySimulationCheck_1.runDrySimulationCheck)());
    const summary = {
        passed: allChecks.filter((c) => c.status === 'pass').length,
        warnings: allChecks.filter((c) => c.status === 'warn').length,
        failed: allChecks.filter((c) => c.status === 'fail').length,
        blockingFailures: allChecks.filter((c) => c.status === 'fail' && c.blocking).length,
    };
    let overallStatus;
    if (summary.blockingFailures > 0) {
        overallStatus = 'rejected';
    }
    else if (summary.failed > 0 || summary.warnings > 0) {
        overallStatus = 'approved_with_warnings';
    }
    else {
        overallStatus = 'approved';
    }
    const finishedAt = new Date().toISOString();
    const report = {
        startedAt,
        finishedAt,
        mode,
        overallStatus,
        checks: allChecks,
        summary,
    };
    (0, fileWriter_1.writeJsonFile)('outputs/preflight-report.json', report);
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
    }
    else {
        for (const b of blocking) {
            md += `- **${b.title}** (${b.key}) - ${b.message}\n`;
        }
        md += '\n';
    }
    md += `### Principais warnings\n\n`;
    if (!warnings.length) {
        md += 'Nenhum warning relevante identificado.\n\n';
    }
    else {
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
    }
    else if (overallStatus === 'approved_with_warnings') {
        md +=
            '- É possível seguir para `apply`, mas revise os warnings (permissões, dependências, JQLs contextuais, simulação) e ajuste o que for crítico para o seu ambiente.\n\n';
    }
    else {
        md +=
            '- O ambiente está pronto do ponto de vista técnico para `apply`. Ainda assim, é recomendado revisar o relatório e executar inicialmente em um ambiente de testes.\n\n';
    }
    md += '## Checks detalhados\n\n';
    md += '| Key | Título | Status | Severidade | Blocking | Mensagem |\n';
    md += '| --- | ------ | ------ | ---------- | -------- | -------- |\n';
    for (const c of allChecks) {
        md += `| ${c.key} | ${c.title} | ${c.status} | ${c.severity} | ${c.blocking ? 'sim' : 'não'} | ${c.message.replace(/\|/g, '\\|')} |\n`;
    }
    md += '\n';
    (0, fileWriter_1.writeTextFile)('outputs/preflight-report.md', md);
    logger.info(`Preflight concluído com status geral "${overallStatus}". Veja outputs/preflight-report.* para detalhes.`);
    return report;
}
