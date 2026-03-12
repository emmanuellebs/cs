import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';
import {
  FieldsProvisionConfig,
  FieldConfig,
  FieldKind,
  loadFieldsProvisionConfig,
} from '../config/fieldsConfig';
import { ProvisioningItemResult, ProvisionStatus } from '../utils/types';

const logger = new Logger({ module: 'fieldService' });

interface JiraField {
  id: string;
  name: string;
  description?: string;
  schema?: {
    type?: string;
    custom?: string;
  };
}

interface JiraFieldContext {
  id: string;
  name: string;
  projectIds?: string[];
  issueTypeIds?: string[];
}

interface JiraFieldOption {
  id: string;
  value: string;
}

interface PagedResponse<T> {
  isLast: boolean;
  maxResults: number;
  startAt: number;
  values: T[];
}

export interface FieldsProvisionResult {
  fieldResults: ProvisioningItemResult[];
  contextResults: ProvisioningItemResult[];
  optionResults: ProvisioningItemResult[];
}

function mapKindToTypeAndSearcher(kind: FieldKind): { type: string; searcherKey: string } {
  switch (kind) {
    case 'number':
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:exactnumber',
      };
    case 'date':
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:datepicker',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:daterange',
      };
    case 'paragraph':
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
      };
    case 'select':
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:select',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:multiselectsearcher',
      };
    case 'userPicker':
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:userpicker',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:userpickergroupsearcher',
      };
    case 'text':
    default:
      return {
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
      };
  }
}

async function listAllFields(): Promise<JiraField[]> {
  const resp = await jiraClient.request<JiraField[]>({
    url: '/field',
    method: 'GET',
  });
  return resp.data;
}

async function createField(cfg: FieldConfig): Promise<JiraField> {
  const mapped = mapKindToTypeAndSearcher(cfg.kind);
  const resp = await jiraClient.request<JiraField>({
    url: '/field',
    method: 'POST',
    data: {
      name: cfg.name,
      description: cfg.description ?? '',
      type: mapped.type,
      searcherKey: mapped.searcherKey,
    },
  });
  return resp.data;
}

function buildFieldResult(
  cfg: FieldConfig,
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: `field:${cfg.key}`,
    name: cfg.name,
    status,
    ...extra,
  };
}

function buildContextResult(
  fieldId: string,
  fieldName: string,
  ctxName: string,
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: `fieldContext:${fieldId}:${ctxName}`,
    name: `${fieldName} / ${ctxName}`,
    status,
    ...extra,
  };
}

function buildOptionResult(
  fieldId: string,
  fieldName: string,
  ctxId: string,
  optionValue: string,
  status: ProvisionStatus,
  extra: Partial<ProvisioningItemResult> = {}
): ProvisioningItemResult {
  return {
    key: `fieldOption:${fieldId}:${ctxId}:${optionValue}`,
    name: `${fieldName} / ${optionValue}`,
    status,
    ...extra,
  };
}

async function listFieldContexts(fieldId: string): Promise<JiraFieldContext[]> {
  const resp = await jiraClient.request<PagedResponse<JiraFieldContext>>({
    url: `/field/${encodeURIComponent(fieldId)}/context`,
    method: 'GET',
  });
  return resp.data.values || [];
}

async function createFieldContext(
  field: JiraField,
  projectId: string
): Promise<JiraFieldContext> {
  const name = `Contexto CS - ${field.name}`;
  const resp = await jiraClient.request<JiraFieldContext>({
    url: `/field/${encodeURIComponent(field.id)}/context`,
    method: 'POST',
    data: {
      name,
      projectIds: [projectId],
    },
  });
  return resp.data;
}

async function listFieldOptions(
  fieldId: string,
  contextId: string
): Promise<JiraFieldOption[]> {
  const resp = await jiraClient.request<PagedResponse<JiraFieldOption>>({
    url: `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(
      contextId
    )}/option`,
    method: 'GET',
  });
  return resp.data.values || [];
}

async function createFieldOptions(
  fieldId: string,
  contextId: string,
  values: string[]
): Promise<JiraFieldOption[]> {
  if (!values.length) {
    return [];
  }

  const resp = await jiraClient.request<{ options: JiraFieldOption[] }>({
    url: `/field/${encodeURIComponent(fieldId)}/context/${encodeURIComponent(
      contextId
    )}/option`,
    method: 'POST',
    data: {
      options: values.map((v) => ({ value: v })),
    },
  });
  return resp.data.options || [];
}

/**
 * Garante campo, contexto por projeto e opções (para campos select).
 * Não lança exceção em caso de falha isolada; registra status no resultado.
 */
export async function ensureFieldsForProject(
  projectId: string
): Promise<FieldsProvisionResult> {
  const config: FieldsProvisionConfig = loadFieldsProvisionConfig();
  const mode = jiraClient.getMode();

  const allFields = await listAllFields();
  const fieldResults: ProvisioningItemResult[] = [];
  const contextResults: ProvisioningItemResult[] = [];
  const optionResults: ProvisioningItemResult[] = [];

  for (const cfg of config.fields) {
    try {
      // 1) Campo
      let field = allFields.find((f) => f.name === cfg.name) || null;
      if (field) {
        logger.info(`Campo reutilizado: ${cfg.name} (${field.id})`);
        fieldResults.push(
          buildFieldResult(cfg, 'reused', {
            jiraId: field.id,
            details: 'Campo já existente foi reutilizado.',
          })
        );
      } else if (mode.mode === 'audit' || mode.dryRun) {
        logger.info(
          `Campo ${cfg.name} não existe. Modo atual impede criação automática (mode=${mode.mode}, dryRun=${mode.dryRun}).`
        );
        fieldResults.push(
          buildFieldResult(cfg, 'skipped', {
            details:
              'Campo não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
          })
        );
      } else {
        try {
          field = await createField(cfg);
          allFields.push(field);
          logger.info(`Campo criado: ${cfg.name} (${field.id})`);
          fieldResults.push(
            buildFieldResult(cfg, 'created', {
              jiraId: field.id,
              details: 'Campo criado via API.',
            })
          );
        } catch (err: any) {
          logger.error(`Falha ao criar campo ${cfg.name}.`, err);
          fieldResults.push(
            buildFieldResult(cfg, 'failed', {
              details: 'Falha ao criar campo via API.',
              error: err?.message,
            })
          );
        }
      }

      // Se não existe fieldId conhecido, não conseguimos criar contexto/opções
      if (!field || !field.id) {
        if (cfg.kind === 'select') {
          contextResults.push(
            buildContextResult('unknown', cfg.name, 'Contexto CS', 'manual', {
              details:
                'Campo select não foi criado/reutilizado. Contexto e opções precisam ser configurados manualmente.',
            })
          );
        }
        continue;
      }

      // 2) Contexto específico para o projeto (apenas para selects, mas deixamos pronto para outros se necessário)
      let context: JiraFieldContext | null = null;
      try {
        const contexts = await listFieldContexts(field.id);
        context =
          contexts.find((c) => c.projectIds && c.projectIds.includes(projectId)) || null;
        if (context) {
          logger.info(
            `Contexto de campo reutilizado para ${cfg.name} no projeto ${projectId}: ${context.id}`
          );
          contextResults.push(
            buildContextResult(field.id, cfg.name, context.name, 'reused', {
              jiraId: context.id,
              details: 'Contexto de campo existente foi reutilizado.',
            })
          );
        } else if (mode.mode === 'audit' || mode.dryRun) {
          logger.info(
            `Campo ${cfg.name} não possui contexto específico para o projeto ${projectId}. Modo atual impede criação automática.`
          );
          contextResults.push(
            buildContextResult(field.id, cfg.name, 'Contexto CS', 'skipped', {
              details:
                'Contexto por projeto não existe e não foi criado em modo audit/dry-run. Em modo apply com dryRun=false, será criado.',
            })
          );
        } else {
          context = await createFieldContext(field, projectId);
          logger.info(
            `Contexto de campo criado para ${cfg.name} no projeto ${projectId}: ${context.id}`
          );
          contextResults.push(
            buildContextResult(field.id, cfg.name, context.name, 'created', {
              jiraId: context.id,
              details: 'Contexto de campo criado via API para o projeto.',
            })
          );
        }
      } catch (err: any) {
        logger.error(
          `Falha ao garantir contexto de campo para ${cfg.name} no projeto ${projectId}.`,
          err
        );
        contextResults.push(
          buildContextResult(field.id, cfg.name, 'Contexto CS', 'failed', {
            details: 'Falha ao garantir contexto de campo.',
            error: err?.message,
          })
        );
      }

      // 3) Opções para campos select (idempotente, sem apagar opções existentes)
      if (cfg.kind === 'select' && cfg.options && cfg.options.length > 0) {
        if (!context || !context.id) {
          optionResults.push(
            buildOptionResult(field.id, cfg.name, 'unknown', '', 'manual', {
              details:
                'Contexto não disponível. Opções do campo precisam ser configuradas manualmente.',
            })
          );
          continue;
        }

        try {
          const existingOptions = await listFieldOptions(field.id, context.id);
          const existingByValue = new Map(
            existingOptions.map((o) => [o.value, o] as [string, JiraFieldOption])
          );

          const missingValues: string[] = [];
          for (const opt of cfg.options) {
            const match = existingByValue.get(opt.value);
            if (match) {
              optionResults.push(
                buildOptionResult(field.id, cfg.name, context.id, opt.value, 'reused', {
                  jiraId: match.id,
                  details: 'Opção já existente foi reutilizada.',
                })
              );
            } else if (mode.mode === 'audit' || mode.dryRun) {
              optionResults.push(
                buildOptionResult(field.id, cfg.name, context.id, opt.value, 'skipped', {
                  details:
                    'Opção não existe e não foi criada em modo audit/dry-run. Em modo apply com dryRun=false, será criada.',
                })
              );
            } else {
              missingValues.push(opt.value);
            }
          }

          if (missingValues.length > 0 && !(mode.mode === 'audit' || mode.dryRun)) {
            const createdOptions = await createFieldOptions(
              field.id,
              context.id,
              missingValues
            );
            const createdByValue = new Map(
              createdOptions.map((o) => [o.value, o] as [string, JiraFieldOption])
            );

            for (const value of missingValues) {
              const created = createdByValue.get(value);
              optionResults.push(
                buildOptionResult(field.id, cfg.name, context.id, value, 'created', {
                  jiraId: created?.id,
                  details: 'Opção criada via API.',
                })
              );
            }
          }
        } catch (err: any) {
          logger.error(
            `Falha ao garantir opções do campo ${cfg.name} no projeto ${projectId}.`,
            err
          );
          for (const opt of cfg.options) {
            optionResults.push(
              buildOptionResult(field.id, cfg.name, context?.id || 'unknown', opt.value, 'failed', {
                details: 'Falha ao garantir opção do campo.',
                error: err?.message,
              })
            );
          }
        }
      }
    } catch (err: any) {
      logger.error(`Erro inesperado ao garantir campo ${cfg.name}.`, err);
      fieldResults.push(
        buildFieldResult(cfg, 'failed', {
          details: 'Erro inesperado ao garantir campo.',
          error: err?.message,
        })
      );
    }
  }

  return {
    fieldResults,
    contextResults,
    optionResults,
  };
}

