"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthentication = validateAuthentication;
const jiraClient_1 = require("../clients/jiraClient");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger({ module: 'authService' });
async function validateAuthentication() {
    logger.info('Validando autenticação no Jira (GET /myself)...');
    const response = await jiraClient_1.jiraClient.request({
        url: '/myself',
        method: 'GET',
    });
    const user = response.data;
    logger.info(`Autenticação OK. Usuário: ${user.displayName} (${user.accountId})`);
    return user;
}
