import { loadJiraEnvConfig } from '../../config/envConfig';
import { loadProjectProvisionConfig } from '../../config/projectConfig';
import { loadIssueTypesProvisionConfig } from '../../config/issueTypesConfig';
import { loadFieldsProvisionConfig } from '../../config/fieldsConfig';
import { loadFiltersProvisionConfig } from '../../config/filtersConfig';
import { loadDashboardsProvisionConfig } from '../../config/dashboardsConfig';
import { ValidationCheckResult, ValidationContext } from '../types';

export async function runEnvironmentCheck(
  ctxMode: ValidationContext['mode']
): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];

  try {
    const env = loadJiraEnvConfig();
    const projectCfg = loadProjectProvisionConfig();
    const issueTypesCfg = loadIssueTypesProvisionConfig();
    const fieldsCfg = loadFieldsProvisionConfig();
    const filtersCfg = loadFiltersProvisionConfig();
    const dashboardsCfg = loadDashboardsProvisionConfig();

    const push = (res: ValidationCheckResult) => results.push(res);

    const requiredEnv: Array<[string, string | null | undefined]> = [
      ['JIRA_BASE_URL', env.baseUrl],
      ['JIRA_EMAIL', env.email],
      ['JIRA_API_TOKEN', env.apiToken],
      ['JIRA_PROJECT_KEY', env.projectKey],
      ['JIRA_PROJECT_NAME', env.projectName],
    ];

    for (const [key, value] of requiredEnv) {
      if (!value) {
        push({
          key: `env:${key.toLowerCase()}`,
          title: `Variável de ambiente obrigatória: ${key}`,
          status: 'fail',
          severity: 'critical',
          message: `${key} não está definida.`,
          blocking: true,
        });
      } else {
        push({
          key: `env:${key.toLowerCase()}`,
          title: `Variável de ambiente obrigatória: ${key}`,
          status: 'pass',
          severity: 'info',
          message: `${key} está definida.`,
          blocking: false,
        });
      }
    }

    // Project type/template
    if (!projectCfg.projectTypeKey || !projectCfg.projectTemplateKey) {
      push({
        key: 'env:project-template',
        title: 'Configuração de template de projeto',
        status: 'fail',
        severity: 'high',
        message: 'projectTypeKey ou projectTemplateKey não estão configurados.',
        blocking: true,
      });
    } else {
      push({
        key: 'env:project-template',
        title: 'Configuração de template de projeto',
        status: 'pass',
        severity: 'info',
        message: `Template de projeto configurado (${projectCfg.projectTypeKey} / ${projectCfg.projectTemplateKey}).`,
        blocking: false,
      });
    }

    // Project lead account id (opcional, mas recomendado)
    push({
      key: 'env:project-lead',
      title: 'Project lead account id',
      status: env.projectLeadAccountId ? 'pass' : 'warn',
      severity: env.projectLeadAccountId ? 'info' : 'low',
      message: env.projectLeadAccountId
        ? 'JIRA_PROJECT_LEAD_ACCOUNT_ID configurado.'
        : 'JIRA_PROJECT_LEAD_ACCOUNT_ID não configurado. O Jira usará padrões; avalie se isso é aceitável.',
      blocking: false,
    });

    // Project key formato Jira (apenas regex básica)
    const keyRegex = /^[A-Z][A-Z0-9]+$/;
    const keyValid = keyRegex.test(env.projectKey);
    results.push({
      key: 'env:project-key-format',
      title: 'Formato da project key',
      status: keyValid ? 'pass' : 'warn',
      severity: keyValid ? 'info' : 'medium',
      message: keyValid
        ? 'JIRA_PROJECT_KEY parece válido para Jira (apenas letras maiúsculas e dígitos, iniciando com letra).'
        : 'JIRA_PROJECT_KEY pode ser inválido para Jira. Use apenas letras maiúsculas e dígitos, iniciando com letra.',
      blocking: false,
    });

    // Carregamento de configs (se chegou aqui sem throw, estão ok)
    push({
      key: 'config:issuetypes-load',
      title: 'Carregamento de configuração de issue types',
      status: issueTypesCfg.issueTypes.length ? 'pass' : 'fail',
      severity: issueTypesCfg.issueTypes.length ? 'info' : 'high',
      message: issueTypesCfg.issueTypes.length
        ? `Foram carregados ${issueTypesCfg.issueTypes.length} issue types lógicos.`
        : 'Nenhum issue type lógico configurado.',
      blocking: !issueTypesCfg.issueTypes.length,
    });

    push({
      key: 'config:fields-load',
      title: 'Carregamento de configuração de campos',
      status: fieldsCfg.fields.length ? 'pass' : 'fail',
      severity: fieldsCfg.fields.length ? 'info' : 'high',
      message: fieldsCfg.fields.length
        ? `Foram carregados ${fieldsCfg.fields.length} campos lógicos.`
        : 'Nenhum campo lógico configurado.',
      blocking: !fieldsCfg.fields.length,
    });

    push({
      key: 'config:filters-load',
      title: 'Carregamento de configuração de filtros',
      status: filtersCfg.filters.length ? 'pass' : 'fail',
      severity: filtersCfg.filters.length ? 'info' : 'high',
      message: filtersCfg.filters.length
        ? `Foram carregados ${filtersCfg.filters.length} filtros configurados.`
        : 'Nenhum filtro configurado.',
      blocking: !filtersCfg.filters.length,
    });

    push({
      key: 'config:dashboards-load',
      title: 'Carregamento de configuração de dashboards',
      status: dashboardsCfg.dashboards.length ? 'pass' : 'fail',
      severity: dashboardsCfg.dashboards.length ? 'info' : 'medium',
      message: dashboardsCfg.dashboards.length
        ? `Foram carregados ${dashboardsCfg.dashboards.length} dashboards configurados.`
        : 'Nenhum dashboard configurado.',
      blocking: false,
    });
  } catch (err: any) {
    results.push({
      key: 'env:load-failure',
      title: 'Falha ao carregar configuração de ambiente',
      status: 'fail',
      severity: 'critical',
      message: 'Erro ao carregar variáveis de ambiente ou configurações iniciais.',
      details: [String(err?.message ?? err)],
      blocking: true,
    });
  }

  return results;
}

