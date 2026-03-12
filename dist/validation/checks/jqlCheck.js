"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJqlCheck = runJqlCheck;
const jiraClient_1 = require("../../clients/jiraClient");
const filtersConfig_1 = require("../../config/filtersConfig");
const projectConfig_1 = require("../../config/projectConfig");
async function runJqlCheck() {
    const results = [];
    const filtersCfg = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const { jira } = (0, projectConfig_1.loadProjectProvisionConfig)();
    for (const cfg of filtersCfg.filters) {
        const jql = cfg.jqlTemplate.replace(/{projectKey}/g, jira.projectKey);
        try {
            // Validação estrita via search/jql (API v3), sem retornar issues (maxResults=1 é mínimo)
            await jiraClient_1.jiraClient.request({
                url: `/search/jql?jql=${encodeURIComponent(jql)}&maxResults=1&validateQuery=strict`,
                method: 'GET',
            });
            results.push({
                key: `jql:${cfg.key}`,
                title: `Validação de JQL para filtro "${cfg.name}"`,
                status: 'pass',
                severity: 'info',
                message: 'JQL validada com sucesso (sintaxe e campos aparentam estar corretos).',
                blocking: false,
                metadata: { jql },
            });
        }
        catch (err) {
            const status = err?.response?.status;
            const data = (err?.response?.data || {});
            const messages = data.errorMessages || [];
            const errors = data.errors || {};
            const details = [];
            if (messages.length) {
                details.push(...messages);
            }
            for (const [k, v] of Object.entries(errors)) {
                details.push(`${k}: ${v}`);
            }
            // Diferenciar erro sintático vs contextual
            const msgCombined = details.join(' ') || String(err?.message ?? err);
            const isSyntaxError = msgCombined.includes('Error in the JQL Query') ||
                msgCombined.toLowerCase().includes('parse') ||
                msgCombined.toLowerCase().includes('expected');
            const referencesUnknownField = msgCombined.toLowerCase().includes('does not exist') ||
                msgCombined.toLowerCase().includes('field') && msgCombined.toLowerCase().includes('unknown');
            let statusLabel = 'fail';
            let severity = 'high';
            let blocking = false;
            let message;
            if (isSyntaxError) {
                // Sintaxe inválida -> sempre bloqueante para apply
                statusLabel = 'fail';
                severity = 'high';
                blocking = true;
                message = `JQL sintaticamente inválida para filtro "${cfg.name}".`;
            }
            else if (referencesUnknownField) {
                // Campo potencialmente inexistente -> contextual
                statusLabel = 'warn';
                severity = 'medium';
                blocking = false;
                message = `JQL parece referenciar campo(s) inexistente(s) ou ainda não provisionado(s) para filtro "${cfg.name}".`;
            }
            else if (status === 400) {
                // Outro erro de validação -> tratar como falha não sintática
                statusLabel = 'warn';
                severity = 'medium';
                blocking = false;
                message = `Falha de validação de JQL para filtro "${cfg.name}" (não claramente sintática).`;
            }
            else {
                statusLabel = 'warn';
                severity = 'medium';
                blocking = false;
                message = `Erro ao validar JQL para filtro "${cfg.name}".`;
            }
            results.push({
                key: `jql:${cfg.key}`,
                title: `Validação de JQL para filtro "${cfg.name}"`,
                status: statusLabel,
                severity,
                message,
                details: [msgCombined],
                blocking,
                metadata: { jql, status },
            });
        }
    }
    return results;
}
