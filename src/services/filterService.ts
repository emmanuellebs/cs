import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';
import {
  FiltersProvisionConfig,
  FilterConfig,
  LogicalFilterKey,
  loadFiltersProvisionConfig,
} from '../config/filtersConfig';
import { ProvisioningItemResult, ProvisionStatus } from '../utils/types';
import { loadJiraEnvConfig } from '../config/envConfig';

const logger = new Logger({ module: 'filterService' });

interface JiraFilter {
  id: string;
  name: string;
  jql: string;
  description?: string;
}

interface FilterSearchResponse {
  values: JiraFilter[];
}

export interface FiltersProvisionResult {
  filterResults: ProvisioningItemResult[];
  logicalToFilterId: Record<LogicalFilterKey, string | null>;
  boardBaseFilterId: string | null;
}

function buildFilterResult(
  cfg: FilterConfig,
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: `filter:${cfg.key}`,
    name: cfg.name,
    status,
    ...extra,
  };
}

async function findFiltersByName(name: string): Promise<JiraFilter[]> {
  const resp = await jiraClient.request<FilterSearchResponse>({
    url: `/filter/search?filterName=${encodeURIComponent(name)}`,
    method: 'GET',
  });
  return resp.data.values || [];
}

async function createFilter(cfg: FilterConfig, jql: string): Promise<JiraFilter> {
  const resp = await jiraClient.request<JiraFilter>({
    url: '/filter',
    method: 'POST',
    data: {
      name: cfg.name,
      description: cfg.description ?? '',
      jql,
    },
  });
  return resp.data;
}

export async function ensureFilters(): Promise<FiltersProvisionResult> {
  const config: FiltersProvisionConfig = loadFiltersProvisionConfig();
  const env = loadJiraEnvConfig();
  const mode = jiraClient.getMode();

  const filterResults: ProvisioningItemResult[] = [];
  const logicalToFilterId: Record<LogicalFilterKey, string | null> = {
    clientsAtRisk: null,
    upcomingRenewals: null,
    noRecentInteractions: null,
    openOpportunities: null,
    accountsByLifecycle: null,
    activeAccounts: null,
    churnedAccounts: null,
    interactionsThisMonth: null,
    boardBase: null,
  };

  let boardBaseFilterId: string | null = null;

  for (const cfg of config.filters) {
    try {
      const jql = cfg.jqlTemplate.replace(/{projectKey}/g, env.projectKey);

      // 1) Busca por nome
      const existingFilters = await findFiltersByName(cfg.name);
      const existing = existingFilters.find((f) => f.name === cfg.name) || null;

      if (existing) {
        logger.info(`Filtro reutilizado: ${cfg.name} (${existing.id})`);
        logicalToFilterId[cfg.key] = existing.id;
        if (cfg.isBoardBase) {
          boardBaseFilterId = existing.id;
        }
        filterResults.push(
          buildFilterResult(cfg, 'reused', {
            jiraId: existing.id,
            details: 'Filtro já existente foi reutilizado.',
            metadata: { jql: existing.jql },
          })
        );
        continue;
      }

      if (mode.mode === 'audit' || mode.dryRun) {
        logger.info(
          `Filtro ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`
        );
        logicalToFilterId[cfg.key] = null;
        filterResults.push(
          buildFilterResult(cfg, 'skipped', {
            details:
              'Filtro não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
            metadata: { jql },
          })
        );
        continue;
      }

      // Criação em modo apply
      try {
        const created = await createFilter(cfg, jql);
        logger.info(`Filtro criado: ${cfg.name} (${created.id})`);
        logicalToFilterId[cfg.key] = created.id;
        if (cfg.isBoardBase) {
          boardBaseFilterId = created.id;
        }
        filterResults.push(
          buildFilterResult(cfg, 'created', {
            jiraId: created.id,
            details: 'Filtro criado via API.',
            metadata: { jql: created.jql },
          })
        );
      } catch (err: any) {
        logger.error(`Falha ao criar filtro ${cfg.name}.`, err);
        logicalToFilterId[cfg.key] = null;
        filterResults.push(
          buildFilterResult(cfg, 'failed', {
            details: 'Falha ao criar filtro via API.',
            error: err?.message,
            metadata: { jql },
          })
        );
      }
    } catch (err: any) {
      logger.error(`Erro inesperado ao garantir filtro ${cfg.name}.`, err);
      logicalToFilterId[cfg.key] = null;
      filterResults.push(
        buildFilterResult(cfg, 'failed', {
          details: 'Erro inesperado ao garantir filtro.',
          error: err?.message,
        })
      );
    }
  }

  return {
    filterResults,
    logicalToFilterId,
    boardBaseFilterId,
  };
}

