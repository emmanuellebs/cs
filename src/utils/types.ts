export type ProvisionStatus = 'created' | 'reused' | 'skipped' | 'manual' | 'failed';

export type ExecutionMode = 'preflight' | 'audit' | 'apply';

export interface RuntimeConfig {
  mode: ExecutionMode;
  dryRun: boolean;
}

export interface ProvisioningItemResult {
  key: string;
  name?: string;
  status: ProvisionStatus;
  details?: string;
  jiraId?: string;
  jiraKey?: string;
  warnings?: string[];
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ProvisioningReport {
  project: ProvisioningItemResult | null;
  issueTypes: ProvisioningItemResult[];
  fields: ProvisioningItemResult[];
  fieldContexts: ProvisioningItemResult[];
  fieldOptions: ProvisioningItemResult[];
  filters: ProvisioningItemResult[];
  boards: ProvisioningItemResult[];
  dashboards: ProvisioningItemResult[];
  sampleIssues: ProvisioningItemResult[];
  manualSteps: ProvisioningItemResult[];
}

export function createEmptyReport(): ProvisioningReport {
  return {
    project: null,
    issueTypes: [],
    fields: [],
    fieldContexts: [],
    fieldOptions: [],
    filters: [],
    boards: [],
    dashboards: [],
    sampleIssues: [],
    manualSteps: [],
  };
}

