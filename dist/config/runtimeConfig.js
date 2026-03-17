"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRuntimeConfig = loadRuntimeConfig;
function parseModeFromArgs() {
    const args = process.argv.slice(2);
    const modeArg = args.find((a) => a.startsWith('--mode='));
    if (modeArg) {
        const value = modeArg.split('=')[1];
        if (value === 'preflight' || value === 'audit' || value === 'apply') {
            return value;
        }
    }
    return undefined;
}
function loadRuntimeConfig() {
    const envMode = process.env.JIRA_MODE?.toLowerCase();
    const cliMode = parseModeFromArgs();
    const mode = cliMode || envMode || 'audit';
    const dryRunEnv = process.env.JIRA_DRY_RUN;
    const dryRun = dryRunEnv ? dryRunEnv.toLowerCase() === 'true' : mode === 'audit';
    const createSampleDataEnv = process.env.CREATE_SAMPLE_DATA;
    const createSampleData = createSampleDataEnv ? createSampleDataEnv.toLowerCase() === 'true' : false;
    return { mode, dryRun, createSampleData };
}
