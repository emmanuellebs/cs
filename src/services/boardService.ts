import { agileClient } from '../clients/agileClient';
import { Logger } from '../utils/logger';
import { loadBoardProvisionConfig } from '../config/boardConfig';
import { ProvisioningItemResult, ProvisionStatus } from '../utils/types';
import { loadJiraEnvConfig } from '../config/envConfig';

const logger = new Logger({ module: 'boardService' });

interface JiraBoard {
  id: number;
  name: string;
  type: string;
  location?: {
    projectKey?: string;
    projectId?: string;
  };
}

interface PagedBoards {
  values: JiraBoard[];
  isLast: boolean;
  maxResults: number;
  startAt: number;
}

export interface BoardProvisionResult {
  boardResult: ProvisioningItemResult | null;
}

function buildBoardResult(
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: 'board:kanban',
    status,
    ...extra,
  };
}

async function listBoardsForProject(projectKey: string): Promise<JiraBoard[]> {
  const resp = await agileClient.request<PagedBoards>({
    url: `/board?projectKeyOrId=${encodeURIComponent(projectKey)}`,
    method: 'GET',
  });
  return resp.data.values || [];
}

async function createKanbanBoard(
  projectKey: string,
  filterId: string,
  name: string
): Promise<JiraBoard> {
  const resp = await agileClient.request<JiraBoard>({
    url: '/board',
    method: 'POST',
    data: {
      name,
      type: 'kanban',
      filterId: Number(filterId),
      location: {
        type: 'project',
        projectKeyOrId: projectKey,
      },
    },
  });
  return resp.data;
}

export async function ensureKanbanBoard(boardBaseFilterId: string | null): Promise<BoardProvisionResult> {
  const env = loadJiraEnvConfig();
  const cfg = loadBoardProvisionConfig();
  const mode = agileClient.getMode();

  try {
    const boards = await listBoardsForProject(env.projectKey);
    const existing = boards.find((b) => b.name === cfg.name && b.type === 'kanban') || null;

    if (existing) {
      logger.info(`Board Kanban reutilizado: ${cfg.name} (${existing.id})`);
      return {
        boardResult: buildBoardResult('reused', {
          name: cfg.name,
          jiraId: String(existing.id),
          details: 'Board Kanban já existente foi reutilizado.',
        }),
      };
    }

    if (!boardBaseFilterId) {
      logger.warn(
        'Nenhum filtro base para o board foi identificado. O board não será criado automaticamente.'
      );
      return {
        boardResult: buildBoardResult('manual', {
          name: cfg.name,
          details:
            'Sem filtro base disponível. Crie manualmente um board Kanban com filtro "project = {projectKey}".',
          metadata: {
            suggestedJql: `project = ${env.projectKey} ORDER BY updated DESC`,
          },
        }),
      };
    }

    if (mode.mode === 'audit' || mode.dryRun) {
      logger.info(
        `Board Kanban ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`
      );
      return {
        boardResult: buildBoardResult('skipped', {
          name: cfg.name,
          details:
            'Board não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado usando o filtro base.',
          metadata: {
            boardBaseFilterId,
          },
        }),
      };
    }

    try {
      const created = await createKanbanBoard(env.projectKey, boardBaseFilterId, cfg.name);
      logger.info(`Board Kanban criado: ${cfg.name} (${created.id})`);
      return {
        boardResult: buildBoardResult('created', {
          name: cfg.name,
          jiraId: String(created.id),
          details: 'Board Kanban criado via API usando filtro base do projeto.',
          metadata: {
            boardBaseFilterId,
            type: created.type,
          },
        }),
      };
    } catch (err: any) {
      logger.error(`Falha ao criar board Kanban ${cfg.name}.`, err);
      return {
        boardResult: buildBoardResult('failed', {
          name: cfg.name,
          details:
            'Falha ao criar board Kanban via API. Será necessário criar manualmente com o filtro base do projeto.',
          error: err?.message,
          metadata: {
            boardBaseFilterId,
            suggestedJql: `project = ${env.projectKey} ORDER BY updated DESC`,
          },
        }),
      };
    }
  } catch (err: any) {
    logger.error('Erro inesperado ao garantir board Kanban.', err);
    return {
      boardResult: buildBoardResult('failed', {
        name: cfg.name,
        details: 'Erro inesperado ao garantir board Kanban.',
        error: err?.message,
      }),
    };
  }
}

