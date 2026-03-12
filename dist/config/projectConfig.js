"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadProjectProvisionConfig = loadProjectProvisionConfig;
const envConfig_1 = require("./envConfig");
function loadProjectProvisionConfig() {
    const jira = (0, envConfig_1.loadJiraEnvConfig)();
    // Para CS faz sentido usar um projeto de negócio (Jira Work Management)
    // Template business genérico.
    const projectTypeKey = 'business';
    const projectTemplateKey = 'com.atlassian.jira-core-project-templates:jira-core-project-management';
    return {
        jira,
        projectTypeKey,
        projectTemplateKey,
    };
}
