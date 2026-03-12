"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJiraEnvConfig = loadJiraEnvConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
function normalizeBaseUrl(raw) {
    if (!raw) {
        throw new Error('JIRA_BASE_URL não definido.');
    }
    try {
        const url = new URL(raw);
        // Usar apenas origem (https://dominio.atlassian.net)
        const base = `${url.protocol}//${url.host}`;
        if (url.pathname && url.pathname !== '/' && url.pathname !== '') {
            logger_1.rootLogger.warn(`JIRA_BASE_URL contém caminho (${url.pathname}). Usando apenas a origem ${base} para chamadas REST.`);
        }
        return base;
    }
    catch {
        logger_1.rootLogger.warn(`JIRA_BASE_URL parece não ser uma URL completa. Tentando usar valor bruto: ${raw}`);
        return raw.replace(/\/+$/, '');
    }
}
function loadJiraEnvConfig() {
    const baseUrl = normalizeBaseUrl(process.env.JIRA_BASE_URL);
    const email = process.env.JIRA_EMAIL || '';
    const apiToken = process.env.JIRA_API_TOKEN || '';
    const projectKey = process.env.JIRA_PROJECT_KEY || '';
    const projectName = process.env.JIRA_PROJECT_NAME || '';
    const projectLeadAccountId = process.env.JIRA_PROJECT_LEAD_ACCOUNT_ID || '';
    const defaultAssigneeAccountId = process.env.DEFAULT_ASSIGNEE_ACCOUNT_ID || '';
    if (!email || !apiToken) {
        throw new Error('JIRA_EMAIL e/ou JIRA_API_TOKEN não configurados.');
    }
    if (!projectKey || !projectName) {
        throw new Error('JIRA_PROJECT_KEY e JIRA_PROJECT_NAME são obrigatórios.');
    }
    return {
        baseUrl,
        email,
        apiToken,
        projectKey,
        projectName,
        projectLeadAccountId: projectLeadAccountId || null,
        defaultAssigneeAccountId: defaultAssigneeAccountId || null,
    };
}
