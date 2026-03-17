import { loadFiltersProvisionConfig } from '../../config/filtersConfig';
import { loadDashboardsProvisionConfig } from '../../config/dashboardsConfig';
import { loadProjectProvisionConfig } from '../../config/projectConfig';
import { loadFieldsProvisionConfig } from '../../config/fieldsConfig';
import { ValidationCheckResult } from '../types';

export async function runDependencyCheck(): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];
  const filtersCfg = loadFiltersProvisionConfig();
  const dashboardsCfg = loadDashboardsProvisionConfig();
  const projectCfg = loadProjectProvisionConfig();
  const fieldsCfg = loadFieldsProvisionConfig();

  const push = (r: ValidationCheckResult) => results.push(r);

  // Board depende de filtro base
  const boardBase = filtersCfg.filters.find((f) => f.isBoardBase);
  if (!boardBase) {
    push({
      key: 'dep:board-base-filter',
      title: 'Filtro base para board Kanban',
      status: 'fail',
      severity: 'high',
      message:
        'Nenhum filtro foi marcado como filtro base do board (isBoardBase). O board não poderá ser criado automaticamente.',
      blocking: true,
    });
  } else {
    push({
      key: 'dep:board-base-filter',
      title: 'Filtro base para board Kanban',
      status: 'pass',
      severity: 'info',
      message: `Filtro base identificado: ${boardBase.name}.`,
      blocking: false,
    });
  }

  // Dashboards e gadgets: apenas verificar que jqlTemplate está presente se necessário
  for (const d of dashboardsCfg.dashboards) {
    for (const gadget of d.gadgets) {
      if (!gadget.jqlTemplate) {
        push({
          key: `dep:dashboard-gadget-jql:${d.key}`,
          title: `Dashboard gadget sem JQL template`,
          status: 'warn',
          severity: 'low',
          message: `Dashboard "${d.name}" possui gadget "${gadget.name}" sem jqlTemplate. Verificar manualmente.`,
          blocking: false,
        });
      }
    }
  }

  // Fields dependem de projectId real: aqui apenas alertamos se projectKey parecer inválido (já checado em environment)
  push({
    key: 'dep:fields-projectid',
    title: 'Dependência de projectId para campos/contextos',
    status: 'warn',
    severity: 'low',
    message:
      'Campos customizados e contextos dependem de um projectId real em tempo de execução. Se o projeto não existir, estes passos serão marcados como manuais.',
    blocking: false,
    metadata: {
      projectKey: projectCfg.jira.projectKey,
      totalFields: fieldsCfg.fields.length,
    },
  });

  if (!results.length) {
    push({
      key: 'dep:basic',
      title: 'Validação básica de dependências',
      status: 'pass',
      severity: 'info',
      message: 'Dependências básicas parecem consistentes.',
      blocking: false,
    });
  }

  return results;
}

