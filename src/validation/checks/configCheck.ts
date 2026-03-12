import { loadIssueTypesProvisionConfig } from '../../config/issueTypesConfig';
import { loadFieldsProvisionConfig } from '../../config/fieldsConfig';
import { loadFiltersProvisionConfig } from '../../config/filtersConfig';
import { loadDashboardsProvisionConfig } from '../../config/dashboardsConfig';
import { ValidationCheckResult } from '../types';
import fs from 'fs';
import path from 'path';

export async function runConfigCheck(): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];

  const issueTypesCfg = loadIssueTypesProvisionConfig();
  const fieldsCfg = loadFieldsProvisionConfig();
  const filtersCfg = loadFiltersProvisionConfig();
  const dashboardsCfg = loadDashboardsProvisionConfig();

  const push = (r: ValidationCheckResult) => results.push(r);

  // Issue types: duplicidade e fallback
  {
    const names = new Map<string, number>();
    const lowerNames = new Map<string, string>();
    for (const it of issueTypesCfg.issueTypes) {
      names.set(it.name, (names.get(it.name) || 0) + 1);
      const lower = it.name.toLowerCase();
      if (!lowerNames.has(lower)) {
        lowerNames.set(lower, it.name);
      } else if (lowerNames.get(lower) !== it.name) {
        push({
          key: `config:issuetype-case:${it.key}`,
          title: `Issue type com nome potencialmente conflitante (case-insensitive)`,
          status: 'warn',
          severity: 'medium',
          message: `O nome "${it.name}" conflita (por maiúsculas/minúsculas) com "${lowerNames.get(
            lower
          )}".`,
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
    const nameMap = new Map<string, number>();
    const keyMap = new Map<string, number>();
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
        } else {
          const seen = new Set<string>();
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
    const templatesDir = path.resolve(process.cwd(), 'src', 'templates', 'ticketDescriptions');
    if (!fs.existsSync(templatesDir)) {
      push({
        key: 'config:templates-dir-missing',
        title: 'Diretório de templates de tickets',
        status: 'warn',
        severity: 'low',
        message:
          'Diretório src/templates/ticketDescriptions não encontrado. Templates de descrição serão documentados apenas em texto.',
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

