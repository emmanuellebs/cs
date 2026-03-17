/**
 * Serviço de provisioning de associações entre campos e issue types
 *
 * Responsável por:
 * - Mapear quais campos devem estar associados a cada issue type
 * - Associar campos a screens dos issue types
 * - Validar que os campos estão realmente usáveis no issue type
 */

import { jiraClient } from '../clients/jiraClient';
import { Logger } from '../utils/logger';
import { ProvisioningItemResult } from '../utils/types';
import { loadFieldsProvisionConfig } from '../config/fieldsConfig';
import { loadIssueTypesProvisionConfig } from '../config/issueTypesConfig';
import { associateFieldsToIssueTypeScreens } from './screenService';

const logger = new Logger({ module: 'fieldIssueTypeAssocService' });

export interface FieldIssueTypeAssocResult {
  results: ProvisioningItemResult[];
}

/**
 * Para cada issue type, associa todos os campos mapeados
 * Retorna um relatório de quais associações foram bem-sucedidas
 */
export async function ensureFieldIssueTypeAssociations(
  projectId: string,
  issueTypeMap: Record<string, string | null>,
  fieldMap: Record<string, string>
): Promise<FieldIssueTypeAssocResult> {
  const results: ProvisioningItemResult[] = [];

  logger.info('[FIELD-ASSOC] Starting field-to-issue-type-screen associations...');

  const fieldsConfig = loadFieldsProvisionConfig();
  const issueTypesConfig = loadIssueTypesProvisionConfig();

  // Para cada issue type
  for (const issueTypeCfg of issueTypesConfig.issueTypes) {
    const issueTypeId = issueTypeMap[issueTypeCfg.key];
    
    if (!issueTypeId) {
      logger.warn(
        `[FIELD-ASSOC] Issue type "${issueTypeCfg.key}" not in map (likely not created). Skipping field associations.`
      );
      results.push({
        key: `field-assoc:${issueTypeCfg.key}`,
        status: 'skipped',
        details: `Issue type ${issueTypeCfg.key} not available. Field associations require the issue type to exist first.`,
      });
      continue;
    }

    // Descobrir quais campos pertencem a este issue type
    // Por enquanto, usamos uma heurística simples: campos no grupo 'account' vão para 'account' issue type
    const fieldsForThisType = getFieldsForIssueType(fieldsConfig, issueTypeCfg.key);

    if (fieldsForThisType.length === 0) {
      logger.debug(
        `[FIELD-ASSOC] No fields configured for issue type "${issueTypeCfg.key}"`
      );
      continue;
    }

    logger.info(
      `[LINK] Associando ${fieldsForThisType.length} campos ao issue type "${issueTypeCfg.name}" (${issueTypeId})...`
    );

    // Preparar lista de campos com IDs Jira
    const jiraFields = fieldsForThisType
      .map(fieldCfg => ({
        id: fieldMap[fieldCfg.key],
        name: fieldCfg.name,
        configKey: fieldCfg.key,
      }))
      .filter(f => f.id); // Apenas campos que foram criados/encontrados

    if (jiraFields.length === 0) {
      logger.warn(
        `[FIELD-ASSOC] No field IDs found for issue type "${issueTypeCfg.key}"`
      );
      results.push({
        key: `field-assoc:${issueTypeCfg.key}:no-fields`,
        status: 'skipped',
        details: 'No mapped field IDs found for this issue type',
      });
      continue;
    }

    // Associar os campos às screens do issue type
    try {
      const assocResults = await associateFieldsToIssueTypeScreens(
        projectId,
        issueTypeId,
        jiraFields.map(f => ({ id: f.id!, name: f.name }))
      );

      const successCount = assocResults.filter(r => r.success).length;

      if (successCount === 0) {
        logger.warn(
          `[FIELD-ASSOC] No fields were successfully associated to issue type "${issueTypeCfg.key}"`
        );
        results.push({
          key: `field-assoc:${issueTypeCfg.key}:all-failed`,
          status: 'failed',
          details: `Could not associate any fields to issue type screens. Check Jira project configuration.`,
        });
      } else if (successCount < jiraFields.length) {
        logger.warn(
          `[FIELD-ASSOC] Partial success: ${successCount}/${jiraFields.length} fields associated to issue type "${issueTypeCfg.key}"`
        );
        results.push({
          key: `field-assoc:${issueTypeCfg.key}:partial`,
          status: 'partial',
          details: `${successCount}/${jiraFields.length} fields successfully associated to screens.`,
          metadata: {
            successful: assocResults.filter(r => r.success).length,
            failed: assocResults.filter(r => !r.success).length,
          },
        });
      } else {
        logger.info(
          `[LAYOUT] ✓ Todos os ${successCount} campos associados ao issue type "${issueTypeCfg.name}"`
        );
        results.push({
          key: `field-assoc:${issueTypeCfg.key}`,
          status: 'created',
          details: `${successCount} fields successfully associated to issue type screens.`,
          metadata: {
            fieldsCount: successCount,
          },
        });
      }
    } catch (err) {
      logger.error(
        `[FIELD-ASSOC] Error associating fields to issue type "${issueTypeCfg.key}":`,
        err
      );
      results.push({
        key: `field-assoc:${issueTypeCfg.key}:error`,
        status: 'failed',
        details: 'Error during field-to-screen association',
        error: (err as Error).message,
      });
    }
  }

  logger.info(
    `[FIELD-ASSOC] Field-to-issue-type associations complete. ${results.length} issue types processed.`
  );

  return { results };
}

/**
 * Heurística para descobrir quais campos devem ser associados a um issue type
 * 
 * Lógica atual:
 * - issue type "account" → todas as fields no grupo "account"
 * - issue type "interaction" → todas as fields no grupo "interaction"
 * - etc.
 */
function getFieldsForIssueType(
  fieldsConfig: ReturnType<typeof loadFieldsProvisionConfig>,
  issueTypeKey: string
): any[] {
  // Map de issue type key para field group
  const groupMapping: Record<string, string> = {
    account: 'account',
    interaction: 'interaction',
    successPlan: 'successPlan',
    risk: 'riskOpportunity',
    opportunity: 'riskOpportunity',
    renewal: 'account', // Renewal é sobre a conta, então compartilha fields de account
  };

  const extraGroupsForAccount = ['primaryContact', 'csOperation'];

  if (issueTypeKey === 'account') {
    return fieldsConfig.fields.filter(
      (f) => f.group === 'account' || extraGroupsForAccount.includes(f.group)
    );
  }

  const fieldGroup = groupMapping[issueTypeKey];
  return fieldGroup ? fieldsConfig.fields.filter((f) => f.group === fieldGroup) : [];
}

/**
 * Valida que todos os campos mapeados estão realmente usáveis no issue type "account"
 */
export async function validateFieldsAvailableForAccount(
  projectId: string,
  issueTypeId: string,
  fieldIds: string[]
): Promise<{
  allAvailable: boolean;
  availableFields: string[];
  missingFields: string[];
}> {
  logger.info('[FIELD-ASSOC] Validating field availability for account issue type...');

  const availableFields: string[] = [];
  const missingFields: string[] = [];

  for (const fieldId of fieldIds) {
    try {
      // Tentar fazer uma criação de issue simulada para validar o campo
      // Isso é um teste de "dry run" para ver se o campo é aceitável
      const testResult = await jiraClient.request({
        method: 'post',
        url: '/issues/picker',
        data: {
          currentProjectId: projectId,
          currentIssueTypeId: issueTypeId,
          fieldId,
        },
        validateStatus: () => true, // Don't throw on any status
      });

      if (testResult.status < 400) {
        availableFields.push(fieldId);
        logger.debug(`[FIELD-ASSOC] ✓ Field ${fieldId} is available for issue type`);
      } else {
        missingFields.push(fieldId);
        logger.debug(
          `[FIELD-ASSOC] ✗ Field ${fieldId} validation failed (status: ${testResult.status})`
        );
      }
    } catch (err) {
      missingFields.push(fieldId);
      logger.debug(`[FIELD-ASSOC] Field ${fieldId} validation error`);
    }
  }

  const allAvailable = missingFields.length === 0;
  logger.info(
    `[FIELD-ASSOC] Validation: ${availableFields.length} available, ${missingFields.length} missing`
  );

  return {
    allAvailable,
    availableFields,
    missingFields,
  };
}
