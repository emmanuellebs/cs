import { ExecutionMode, RuntimeConfig } from '../utils/types';

function parseModeFromArgs(): ExecutionMode | undefined {
  const args = process.argv.slice(2);
  const modeArg = args.find((a) => a.startsWith('--mode='));
  if (modeArg) {
    const value = modeArg.split('=')[1] as ExecutionMode;
    if (value === 'preflight' || value === 'audit' || value === 'apply') {
      return value;
    }
  }
  return undefined;
}

export function loadRuntimeConfig(): RuntimeConfig {
  const envMode = (process.env.JIRA_MODE as ExecutionMode | undefined)?.toLowerCase() as ExecutionMode | undefined;
  const cliMode = parseModeFromArgs();
  const mode: ExecutionMode = cliMode || envMode || 'audit';

  const dryRunEnv = process.env.JIRA_DRY_RUN;
  const dryRun = dryRunEnv ? dryRunEnv.toLowerCase() === 'true' : mode === 'audit';

  const createSampleDataEnv = process.env.CREATE_SAMPLE_DATA;
  const createSampleData = createSampleDataEnv ? createSampleDataEnv.toLowerCase() === 'true' : false;

  return { mode, dryRun, createSampleData };
}

