import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';
import {
  DashboardsProvisionConfig,
  DashboardConfig,
  LogicalDashboardKey,
  loadDashboardsProvisionConfig,
} from '../config/dashboardsConfig';
import { ProvisioningItemResult, ProvisionStatus } from '../utils/types';

const logger = new Logger({ module: 'dashboardService' });

interface JiraDashboard {
  id: string;
  name: string;
  description?: string;
}

interface DashboardsResponse {
  dashboards: JiraDashboard[];
}

interface JiraGadget {
  id: number;
  title?: string;
  type?: string;
}

export interface DashboardsProvisionResult {
  dashboardResults: ProvisioningItemResult[];
  logicalToDashboardId: Record<LogicalDashboardKey, string | null>;
}

function buildDashboardResult(
  cfg: DashboardConfig,
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: `dashboard:${cfg.key}`,
    name: cfg.name,
    status,
    ...extra,
  };
}

async function listDashboards(): Promise<JiraDashboard[]> {
  const resp = await jiraClient.request<DashboardsResponse>({
    url: '/dashboard',
    method: 'GET',
  });
  return resp.data.dashboards || [];
}

async function createDashboard(cfg: DashboardConfig): Promise<JiraDashboard> {
  const resp = await jiraClient.request<JiraDashboard>({
    url: '/dashboard',
    method: 'POST',
    data: {
      name: cfg.name,
      description: cfg.description ?? '',
    },
  });
  return resp.data;
}

async function tryListGadgets(dashboardId: string): Promise<JiraGadget[] | null> {
  try {
    const resp = await jiraClient.request<{ gadgets: JiraGadget[] }>({
      url: `/dashboard/${encodeURIComponent(dashboardId)}/gadget`,
      method: 'GET',
    });
    return resp.data.gadgets || [];
  } catch (err: any) {
    logger.warn(
      `Não foi possível listar gadgets via API para o dashboard ${dashboardId}. Isso será tratado como limitação e documentado.`,
    );
    return null;
  }
}

export async function ensureDashboards(): Promise<DashboardsProvisionResult> {
  const config: DashboardsProvisionConfig = loadDashboardsProvisionConfig();
  const mode = jiraClient.getMode();

  const dashboardResults: ProvisioningItemResult[] = [];
  const logicalToDashboardId: Record<LogicalDashboardKey, string | null> = {
    health: null,
    relationship: null,
    growth: null,
  };

  let existingDashboards: JiraDashboard[] = [];
  try {
    existingDashboards = await listDashboards();
  } catch (err: any) {
    logger.error('Falha ao listar dashboards existentes.', err);
    // Ainda assim seguimos, marcando dashboards como manual/failed individualmente
  }

  for (const cfg of config.dashboards) {
    try {
      const existing =
        existingDashboards.find((d) => d.name === cfg.name) || null;

      if (existing) {
        logger.info(`Dashboard reutilizado: ${cfg.name} (${existing.id})`);

        // Tentativa opcional de descobrir gadgets existentes (para fins de documentação)
        const gadgets = await tryListGadgets(existing.id);

        logicalToDashboardId[cfg.key] = existing.id;
        dashboardResults.push(
          buildDashboardResult(cfg, 'reused', {
            jiraId: existing.id,
            details: 'Dashboard já existente foi reutilizado.',
            metadata: {
              gadgetsDiscovered: gadgets
                ? gadgets.map((g) => ({
                    id: g.id,
                    title: g.title,
                    type: g.type,
                  }))
                : 'unavailable',
              gadgetBlueprints: cfg.gadgets,
            },
          }),
        );
        continue;
      }

      if (mode.mode === 'audit' || mode.dryRun) {
        logger.info(
          `Dashboard ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`,
        );
        logicalToDashboardId[cfg.key] = null;
        dashboardResults.push(
          buildDashboardResult(cfg, 'skipped', {
            details:
              'Dashboard não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado vazio e gadgets serão configurados manualmente.',
            metadata: {
              gadgetBlueprints: cfg.gadgets,
            },
          }),
        );
        continue;
      }

      try {
        const created = await createDashboard(cfg);
        logger.info(`Dashboard criado: ${cfg.name} (${created.id})`);

        // Tentativa de ler gadgets (deve ser vazio, mas serve para detectar suporte)
        const gadgets = await tryListGadgets(created.id);

        logicalToDashboardId[cfg.key] = created.id;
        dashboardResults.push(
          buildDashboardResult(cfg, 'created', {
            jiraId: created.id,
            details:
              'Dashboard criado via API. Gadgets devem ser configurados manualmente conforme blueprint.',
            metadata: {
              gadgetsDiscovered: gadgets
                ? gadgets.map((g) => ({
                    id: g.id,
                    title: g.title,
                    type: g.type,
                  }))
                : 'unavailable',
              gadgetBlueprints: cfg.gadgets,
            },
          }),
        );
      } catch (err: any) {
        logger.error(`Falha ao criar dashboard ${cfg.name}.`, err);
        logicalToDashboardId[cfg.key] = null;
        dashboardResults.push(
          buildDashboardResult(cfg, 'manual', {
            details:
              'Falha ao criar dashboard via API. Será necessário criar manualmente e adicionar gadgets conforme blueprint.',
            error: err?.message,
            metadata: {
              gadgetBlueprints: cfg.gadgets,
            },
          }),
        );
      }
    } catch (err: any) {
      logger.error(`Erro inesperado ao garantir dashboard ${cfg.name}.`, err);
      logicalToDashboardId[cfg.key] = null;
      dashboardResults.push(
        buildDashboardResult(cfg, 'failed', {
          details: 'Erro inesperado ao garantir dashboard.',
          error: err?.message,
          metadata: {
            gadgetBlueprints: cfg.gadgets,
          },
        }),
      );
    }
  }

  return {
    dashboardResults,
    logicalToDashboardId,
  };
}

