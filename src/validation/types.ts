import { ExecutionMode } from '../utils/types';
import { JiraEnvConfig } from '../config/envConfig';

export type ValidationStatus = 'pass' | 'warn' | 'fail';

export type ValidationSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface ValidationCheckResult {
  key: string;
  title: string;
  status: ValidationStatus;
  severity: ValidationSeverity;
  message: string;
  details?: string[];
  blocking: boolean;
  metadata?: Record<string, unknown>;
}

export interface PreflightReportSummary {
  passed: number;
  warnings: number;
  failed: number;
  blockingFailures: number;
}

export type PreflightOverallStatus = 'approved' | 'approved_with_warnings' | 'rejected';

export interface PreflightReport {
  startedAt: string;
  finishedAt: string;
  mode: ExecutionMode;
  overallStatus: PreflightOverallStatus;
  checks: ValidationCheckResult[];
  summary: PreflightReportSummary;
}

export interface ValidationContext {
  mode: ExecutionMode;
  env: JiraEnvConfig;
}

