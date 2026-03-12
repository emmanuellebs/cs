"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDependencyCheck = runDependencyCheck;
const filtersConfig_1 = require("../../config/filtersConfig");
const dashboardsConfig_1 = require("../../config/dashboardsConfig");
const projectConfig_1 = require("../../config/projectConfig");
const fieldsConfig_1 = require("../../config/fieldsConfig");
async function runDependencyCheck() {
    const results = [];
    const filtersCfg = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const dashboardsCfg = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    const projectCfg = (0, projectConfig_1.loadProjectProvisionConfig)();
    const fieldsCfg = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    const push = (r) => results.push(r);
    // Board depende de filtro base
    const boardBase = filtersCfg.filters.find((f) => f.isBoardBase);
    if (!boardBase) {
        push({
            key: 'dep:board-base-filter',
            title: 'Filtro base para board Kanban',
            status: 'fail',
            severity: 'high',
            message: 'Nenhum filtro foi marcado como filtro base do board (isBoardBase). O board não poderá ser criado automaticamente.',
            blocking: true,
        });
    }
    else {
        push({
            key: 'dep:board-base-filter',
            title: 'Filtro base para board Kanban',
            status: 'pass',
            severity: 'info',
            message: `Filtro base identificado: ${boardBase.name}.`,
            blocking: false,
        });
    }
    // Dashboards dependem de filtros
    const filterNames = new Set(filtersCfg.filters.map((f) => f.name));
    for (const d of dashboardsCfg.dashboards) {
        for (const gadget of d.gadgets) {
            if (gadget.filterName && !filterNames.has(gadget.filterName)) {
                push({
                    key: `dep:dashboard-filter-missing:${d.key}`,
                    title: `Dashboard com gadget referenciando filtro inexistente`,
                    status: 'fail',
                    severity: 'high',
                    message: `Dashboard "${d.name}" possui gadget "${gadget.name}" que referencia o filtro "${gadget.filterName}", não encontrado na configuração de filtros.`,
                    blocking: true,
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
        message: 'Campos customizados e contextos dependem de um projectId real em tempo de execução. Se o projeto não existir, estes passos serão marcados como manuais.',
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
