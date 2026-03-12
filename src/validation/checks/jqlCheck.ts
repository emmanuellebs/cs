import { jiraClient } from '../../clients/jiraClient';
import { loadFiltersProvisionConfig } from '../../config/filtersConfig';
import { loadProjectProvisionConfig } from '../../config/projectConfig';
import { ValidationCheckResult } from '../types';

interface JiraErrorCollection {
  errorMessages?: string[];
  errors?: Record<string, string>;
}

export async function runJqlCheck(): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];
  const filtersCfg = loadFiltersProvisionConfig();
  const { jira } = loadProjectProvisionConfig();

  for (const cfg of filtersCfg.filters) {
    const jql = cfg.jqlTemplate.replace(/{projectKey}/g, jira.projectKey);

    try {
      // Validação estrita via search/jql (API v3), sem retornar issues (maxResults=1 é mínimo)
      await jiraClient.request({
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
    } catch (err: any) {
      const status = err?.response?.status;
      const data = (err?.response?.data || {}) as JiraErrorCollection;
      const messages = data.errorMessages || [];
      const errors = data.errors || {};
      const details: string[] = [];

      if (messages.length) {
        details.push(...messages);
      }
      for (const [k, v] of Object.entries(errors)) {
        details.push(`${k}: ${v}`);
      }

      // Diferenciar erro sintático vs contextual
      const msgCombined = details.join(' ') || String(err?.message ?? err);
      const isSyntaxError =
        msgCombined.includes('Error in the JQL Query') ||
        msgCombined.toLowerCase().includes('parse') ||
        msgCombined.toLowerCase().includes('expected');

      const referencesUnknownField =
        msgCombined.toLowerCase().includes('does not exist') ||
        msgCombined.toLowerCase().includes('field') && msgCombined.toLowerCase().includes('unknown');

      let statusLabel: 'warn' | 'fail' = 'fail';
      let severity: 'high' | 'medium' = 'high';
      let blocking = false;
      let message: string;

      if (isSyntaxError) {
        // Sintaxe inválida -> sempre bloqueante para apply
        statusLabel = 'fail';
        severity = 'high';
        blocking = true;
        message = `JQL sintaticamente inválida para filtro "${cfg.name}".`;
      } else if (referencesUnknownField) {
        // Campo potencialmente inexistente -> contextual
        statusLabel = 'warn';
        severity = 'medium';
        blocking = false;
        message = `JQL parece referenciar campo(s) inexistente(s) ou ainda não provisionado(s) para filtro "${cfg.name}".`;
      } else if (status === 400) {
        // Outro erro de validação -> tratar como falha não sintática
        statusLabel = 'warn';
        severity = 'medium';
        blocking = false;
        message = `Falha de validação de JQL para filtro "${cfg.name}" (não claramente sintática).`;
      } else {
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

