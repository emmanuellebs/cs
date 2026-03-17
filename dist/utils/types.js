"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyReport = createEmptyReport;
function createEmptyReport() {
    return {
        project: null,
        issueTypes: [],
        fields: [],
        fieldContexts: [],
        fieldOptions: [],
        fieldScreenAssociations: [],
        filters: [],
        boards: [],
        dashboards: [],
        sampleIssues: [],
        manualSteps: [],
    };
}
