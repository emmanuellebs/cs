/**
 * Serviço de associação de campos a telas (screens) de issue types
 *
 * Responsável por:
 * - Descobrir/criar screens para um issue type
 * - Adicionar custom fields às screens
 * - Configurar a visibilidade e edibilidade dos campos
 *
 * IMPORTANTE: Jira Cloud tem limitações com a API de screens.
 * Este serviço implementa o que é possível via API.
 */

import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';

const logger = new Logger({ module: 'screenService' });

interface JiraScreen {
  id: string;
  name: string;
  description?: string;
}

interface JiraScreenField {
  id: string;
  name: string;
  isRequired?: boolean;
}

interface IssueTypeScreenScheme {
  id: string;
  name: string;
  description?: string;
}

interface JiraScreenTab {
  id: string;
  name: string;
}

interface ScreenSchemeDetails {
  id: string;
  name: string;
  screens?: {
    default?: number;
    create?: number;
    edit?: number;
    view?: number;
  };
}

/**
 * Descobre todas as screens disponíveis no Jira Cloud
 */
export async function listScreens(): Promise<JiraScreen[]> {
  try {
    logger.debug('[SCREEN] Listing all screens...');
    const response = await jiraClient.request({
      method: 'get',
      url: '/screens',
      params: {
        maxResults: 100,
      },
    });
    
    const screens = response.data.values || [];
    logger.debug(`[SCREEN] Found ${screens.length} screens`);
    return screens;
  } catch (err) {
    logger.warn('[SCREEN] Error listing screens');
    return [];
  }
}

export async function listScreenTabs(screenId: string): Promise<JiraScreenTab[]> {
  try {
    const response = await jiraClient.request({
      method: 'get',
      url: `/screens/${screenId}/tabs`,
    });
    return response.data || [];
  } catch (err) {
    logger.warn(`[SCREEN] Error listing tabs for screen ${screenId}`);
    return [];
  }
}

async function createScreenTab(screenId: string, name: string): Promise<JiraScreenTab | null> {
  try {
    const response = await jiraClient.request({
      method: 'post',
      url: `/screens/${screenId}/tabs`,
      data: { name },
    });
    return response.data as JiraScreenTab;
  } catch (err) {
    logger.warn(`[SCREEN] Could not create tab "${name}" on screen ${screenId}`);
    return null;
  }
}

async function getFieldsForTab(screenId: string, tabId: string): Promise<JiraScreenField[]> {
  try {
    const response = await jiraClient.request({
      method: 'get',
      url: `/screens/${screenId}/tabs/${tabId}/fields`,
    });
    return response.data || [];
  } catch (err) {
    logger.warn(`[SCREEN] Error getting fields for screen ${screenId} tab ${tabId}`);
    return [];
  }
}

/**
 * Obtém os campos de uma tela específica (varrendo todas as abas)
 */
export async function getScreenFields(screenId: string): Promise<JiraScreenField[]> {
  try {
    const tabs = await listScreenTabs(screenId);
    const fields: JiraScreenField[] = [];
    for (const tab of tabs) {
      const tabFields = await getFieldsForTab(screenId, tab.id);
      fields.push(...tabFields);
    }
    return fields;
  } catch (err) {
    logger.warn(`[SCREEN] Error getting fields for screen ${screenId}`);
    return [];
  }
}

/**
 * Adiciona um campo a uma tela
 */
export async function addFieldToScreen(
  screenId: string,
  fieldId: string
): Promise<boolean> {
  try {
    logger.debug(`[SCREEN] Adding field ${fieldId} to screen ${screenId}...`);

    const tabs = await listScreenTabs(screenId);
    const existingTab = tabs.find((t) => t.name === 'Campos CS') || tabs[0];
    const tab = existingTab || (await createScreenTab(screenId, 'Campos CS'));
    if (!tab) {
      logger.warn(`[SCREEN] No tab available to add field ${fieldId} on screen ${screenId}`);
      return false;
    }

    const alreadyThere = (await getFieldsForTab(screenId, tab.id)).some((f) => f.id === fieldId);
    if (alreadyThere) {
      logger.info(`[LAYOUT] Campo ${fieldId} já presente em ${screenId}/${tab.name}`);
      return true;
    }

    await jiraClient.request({
      method: 'post',
      url: `/screens/${screenId}/tabs/${tab.id}/fields`,
      data: {
        fieldId,
      },
    });

    logger.info(`[LAYOUT] Campo ${fieldId} adicionado à screen ${screenId} (tab ${tab.name})`);
    return true;
  } catch (err: any) {
    const message = (err as Error).message || '';
    logger.warn(`[SCREEN] Error adding field ${fieldId} to screen ${screenId}: ${message}`);
    return false;
  }
}

/**
 * Obtém o issue type screen scheme para um projeto
 */
export async function getIssueTypeScreenScheme(
  projectId: string
): Promise<IssueTypeScreenScheme | null> {
  try {
    logger.debug(`[SCREEN] Getting issue type screen scheme for project ${projectId}...`);
    
    // Use the correct Jira Cloud endpoint: GET /issuetypescreenscheme/project?projectId={projectId}
    const response = await jiraClient.request({
      method: 'get',
      url: `/issuetypescreenscheme/project`,
      params: {
        projectId: projectId,
      },
    });
    
    // Response returns a paginated list of issue type screen schemes for the project
    // Get the first one (usually there's only one per project)
    const schemes = response.data.values || [];
    if (schemes.length === 0) {
      logger.warn(`[SCREEN] No issue type screen scheme found for project ${projectId}`);
      return null;
    }
    
    const schemeMapping = schemes[0];
    const scheme = schemeMapping.issueTypeScreenScheme;
    logger.debug(`[SCREEN] Found scheme: ${scheme.name} (${scheme.id})`);
    return scheme;
  } catch (err) {
    logger.warn(`[SCREEN] Could not get issue type screen scheme for project ${projectId}`);
    return null;
  }
}

/**
 * Get all issue type to screen scheme mappings
 */
async function getAllMappings(): Promise<any[]> {
  try {
    logger.debug('[SCREEN] Getting all issue type screen scheme mappings...');
    const response = await jiraClient.request({
      method: 'get',
      url: `/issuetypescreenscheme/mapping`,
      params: {
        maxResults: 100,
      },
    });
    return response.data.values || [];
  } catch (err) {
    logger.warn('[SCREEN] Could not get issue type screen scheme mappings');
    return [];
  }
}

async function getScreenSchemeDetails(screenSchemeId: string): Promise<ScreenSchemeDetails | null> {
  try {
    const response = await jiraClient.request({
      method: 'get',
      url: `/screenscheme/${screenSchemeId}`,
    });
    return response.data as ScreenSchemeDetails;
  } catch (err) {
    logger.warn(`[SCREEN] Could not get screen scheme ${screenSchemeId}`);
    return null;
  }
}

/**
 * Descobrir screens associadas a um issue type
 * 
 * NOTA: Em Jira Cloud, screens são associadas via
 * issue type screen schemes. Para cada issue type, há um mapping para um screen scheme.
 */
export async function getScreensForIssueType(
  projectId: string,
  issueTypeId: string
): Promise<JiraScreen[]> {
  try {
    logger.debug(
      `[SCREEN] Getting screens for issue type ${issueTypeId} in project ${projectId}...`
    );

    const scheme = await getIssueTypeScreenScheme(projectId);
    if (!scheme) {
      logger.warn('[SCREEN] Could not determine issue type screen scheme');
      return [];
    }

    const allMappings = await getAllMappings();
    const relevantMappings = allMappings.filter(
      (m) =>
        String(m.issueTypeScreenSchemeId) === String(scheme.id) &&
        (m.issueTypeId === issueTypeId || m.issueTypeId === 'default')
    );

    if (!relevantMappings.length) {
      logger.warn(`[SCREEN] No screen scheme mapping found for issue type ${issueTypeId}`);
      return [];
    }

    const mapping =
      relevantMappings.find((m) => m.issueTypeId === issueTypeId) || relevantMappings[0];
    const screenSchemeId = mapping.screenSchemeId;

    const screenScheme = await getScreenSchemeDetails(screenSchemeId);
    const ids = new Set<string>();
    if (screenScheme?.screens) {
      const { create, edit, view, default: def } = screenScheme.screens;
      [create, edit, view, def].forEach((id) => {
        if (id !== undefined && id !== null) {
          ids.add(String(id));
        }
      });
    }

    const catalog = await listScreens();
    const byId = new Map<string, JiraScreen>(catalog.map((s) => [String(s.id), s]));
    const resolved = Array.from(ids).map((id) => byId.get(id) || { id, name: `Screen ${id}` });

    if (resolved.length) {
      logger.debug(`[SCREEN] Resolved ${resolved.length} screens for issue type ${issueTypeId}`);
      return resolved;
    }

    logger.warn(
      '[SCREEN] Could not resolve screens from scheme details; falling back to all screens'
    );
    return catalog;
  } catch (err) {
    logger.warn('[SCREEN] Error getting screens for issue type');
    logger.debug(`Error: ${(err as any).message}`);
    return [];
  }
}

/**
 * Associa um custom field a uma tela de um issue type
 */
export async function associateFieldToIssueTypeScreen(
  projectId: string,
  issueTypeId: string,
  fieldId: string,
  fieldName: string
): Promise<{
  success: boolean;
  screenId?: string;
  error?: string;
}> {
  try {
    logger.info(`[SCREEN] Attempting to associate field ${fieldName} (${fieldId}) to issue type ${issueTypeId}...`);
    
    // Descobrir screens para o issue type
    const screens = await getScreensForIssueType(projectId, issueTypeId);
    
    if (screens.length === 0) {
      logger.warn('[SCREEN] Could not find screens for issue type');
      return {
        success: false,
        error: 'No screens found for issue type',
      };
    }
    
    // Adicionar o campo a cada screen encontrada
    let lastSuccess = false;
    let lastScreenId: string | undefined;
    
    for (const screen of screens) {
      try {
        const fieldAlreadyExists = (await getScreenFields(screen.id)).some(f => f.id === fieldId);
        
        if (fieldAlreadyExists) {
          logger.info(`[LAYOUT] Campo ${fieldName} já está na tela ${screen.name} (${screen.id})`);
          lastSuccess = true;
          lastScreenId = String(screen.id);
          continue;
        }
        
        const added = await addFieldToScreen(screen.id, fieldId);
        if (added) {
          logger.info(
            `[LAYOUT] Campo ${fieldName} adicionado à tela ${screen.name} (${screen.id})`
          );
          lastSuccess = true;
          lastScreenId = String(screen.id);
        }
      } catch (err) {
        logger.debug(`[SCREEN] Could not add to screen ${screen.name}`);
      }
    }
    
    if (lastSuccess) {
      return {
        success: true,
        screenId: lastScreenId,
      };
    }
    
    return {
      success: false,
      error: 'Could not add field to any screens for this issue type',
    };
  } catch (err) {
    logger.error('[SCREEN] Error associating field to issue type screen:', err);
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

/**
 * Batch associate multiple fields to an issue type screens
 */
export async function associateFieldsToIssueTypeScreens(
  projectId: string,
  issueTypeId: string,
  fieldsToAdd: Array<{ id: string; name: string }>
): Promise<Array<{
  fieldId: string;
  fieldName: string;
  success: boolean;
  screenId?: string;
  error?: string;
}>> {
  const results: Array<{
    fieldId: string;
    fieldName: string;
    success: boolean;
    screenId?: string;
    error?: string;
  }> = [];
  
  logger.info(`[SCREEN] Batch associating ${fieldsToAdd.length} fields to issue type ${issueTypeId}...`);
  
  for (const field of fieldsToAdd) {
    const result = await associateFieldToIssueTypeScreen(
      projectId,
      issueTypeId,
      field.id,
      field.name
    );
    
    results.push({
      fieldId: field.id,
      fieldName: field.name,
      ...result,
    });
  }
  
  const successCount = results.filter(r => r.success).length;
  logger.info(`[SCREEN] Batch association complete: ${successCount}/${fieldsToAdd.length} successful`);
  
  return results;
}
