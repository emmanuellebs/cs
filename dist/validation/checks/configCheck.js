"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConfigCheck = runConfigCheck;
const issueTypesConfig_1 = require("../../config/issueTypesConfig");
const fieldsConfig_1 = require("../../config/fieldsConfig");
const filtersConfig_1 = require("../../config/filtersConfig");
const dashboardsConfig_1 = require("../../config/dashboardsConfig");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runConfigCheck() {
    const results = [];
    const issueTypesCfg = (0, issueTypesConfig_1.loadIssueTypesProvisionConfig)();
    const fieldsCfg = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    const filtersCfg = (0, filtersConfig_1.loadFiltersProvisionConfig)();
    const dashboardsCfg = (0, dashboardsConfig_1.loadDashboardsProvisionConfig)();
    const push = (r) => results.push(r);
    // Issue types: duplicidade e fallback
    {
        const names = new Map();
        const lowerNames = new Map();
        for (const it of issueTypesCfg.issueTypes) {
            names.set(it.name, (names.get(it.name) || 0) + 1);
            const lower = it.name.toLowerCase();
            if (!lowerNames.has(lower)) {
                lowerNames.set(lower, it.name);
            }
            else if (lowerNames.get(lower) !== it.name) {
                push({
                    key: `config:issuetype-case:${it.key}`,
                    title: `Issue type com nome potencialmente conflitante (case-insensitive)`,
                    status: 'warn',
                    severity: 'medium',
                    message: `O nome "${it.name}" conflita (por maiúsculas/minúsculas) com "${lowerNames.get(lower)}".`,
                    blocking: false,
                });
            }
        }
        for (const [name, count] of names.entries()) {
            if (count > 1) {
                push({
                    key: `config:issuetype-dup:${name}`,
                    title: `Issue type com nome duplicado`,
                    status: 'fail',
                    severity: 'high',
                    message: `O nome de issue type "${name}" está configurado mais de uma vez.`,
                    blocking: true,
                });
            }
        }
        for (const it of issueTypesCfg.issueTypes) {
            if (!it.fallbackStandardTypeName) {
                push({
                    key: `config:issuetype-fallback:${it.key}`,
                    title: `Fallback de issue type ausente`,
                    status: 'warn',
                    severity: 'low',
                    message: `Issue type lógico "${it.key}" não definiu fallback padrão. Em caso de falha na criação, pode ser necessário ajuste manual.`,
                    blocking: false,
                });
            }
        }
    }
    // Fields: nomes e keys duplicadas, selects sem opções, opções repetidas
    {
        const nameMap = new Map();
        const keyMap = new Map();
        for (const f of fieldsCfg.fields) {
            nameMap.set(f.name, (nameMap.get(f.name) || 0) + 1);
            keyMap.set(f.key, (keyMap.get(f.key) || 0) + 1);
            if (f.kind === 'select') {
                if (!f.options || !f.options.length) {
                    push({
                        key: `config:field-select-no-options:${f.key}`,
                        title: `Campo select sem opções configuradas`,
                        status: 'fail',
                        severity: 'high',
                        message: `Campo select "${f.name}" não possui opções definidas.`,
                        blocking: true,
                    });
                }
                else {
                    const seen = new Set();
                    for (const opt of f.options) {
                        const lower = opt.value.toLowerCase();
                        if (seen.has(lower)) {
                            push({
                                key: `config:field-select-dup-option:${f.key}`,
                                title: `Opções duplicadas em campo select`,
                                status: 'warn',
                                severity: 'low',
                                message: `Campo "${f.name}" possui opções de select repetidas (considerando maiúsculas/minúsculas).`,
                                blocking: false,
                            });
                            break;
                        }
                        seen.add(lower);
                    }
                }
            }
        }
        for (const [name, count] of nameMap.entries()) {
            if (count > 1) {
                push({
                    key: `config:field-name-dup:${name}`,
                    title: `Campo com nome duplicado`,
                    status: 'fail',
                    severity: 'high',
                    message: `O nome de campo "${name}" está configurado mais de uma vez.`,
                    blocking: true,
                });
            }
        }
        for (const [k, count] of keyMap.entries()) {
            if (count > 1) {
                push({
                    key: `config:field-key-dup:${k}`,
                    title: `Campo com chave lógica duplicada`,
                    status: 'fail',
                    severity: 'high',
                    message: `A chave lógica de campo "${k}" está configurada mais de uma vez.`,
                    blocking: true,
                });
            }
        }
    }
    // Filters: jqlTemplate não vazio
    for (const f of filtersCfg.filters) {
        if (!f.jqlTemplate || !f.jqlTemplate.trim()) {
            push({
                key: `config:filter-empty-jql:${f.key}`,
                title: `Filtro com JQL em branco`,
                status: 'fail',
                severity: 'high',
                message: `O filtro "${f.name}" não possui jqlTemplate configurado.`,
                blocking: true,
            });
        }
    }
    // Dashboards: nome e gadgets
    for (const d of dashboardsCfg.dashboards) {
        if (!d.name || !d.name.trim()) {
            push({
                key: `config:dashboard-empty-name:${d.key}`,
                title: 'Dashboard com nome vazio',
                status: 'fail',
                severity: 'medium',
                message: 'Dashboard configurado sem nome.',
                blocking: true,
            });
        }
        if (!d.gadgets || !d.gadgets.length) {
            push({
                key: `config:dashboard-no-gadgets:${d.key}`,
                title: 'Dashboard sem gadgets configurados',
                status: 'warn',
                severity: 'low',
                message: `Dashboard "${d.name}" não possui gadgets configurados. Será criado vazio.`,
                blocking: false,
            });
        }
    }
    // Templates de descrições de issue (apenas como warn se ausentes)
    {
        const templatesDir = path_1.default.resolve(process.cwd(), 'src', 'templates', 'ticketDescriptions');
        if (!fs_1.default.existsSync(templatesDir)) {
            push({
                key: 'config:templates-dir-missing',
                title: 'Diretório de templates de tickets',
                status: 'warn',
                severity: 'low',
                message: 'Diretório src/templates/ticketDescriptions não encontrado. Templates de descrição serão documentados apenas em texto.',
                blocking: false,
            });
        }
    }
    if (!results.length) {
        push({
            key: 'config:basic',
            title: 'Validação básica de configuração',
            status: 'pass',
            severity: 'info',
            message: 'Configurações carregadas sem inconsistências aparentes.',
            blocking: false,
        });
    }
    return results;
}
