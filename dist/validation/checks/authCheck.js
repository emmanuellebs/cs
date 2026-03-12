"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAuthCheck = runAuthCheck;
const authService_1 = require("../../services/authService");
async function runAuthCheck(ctx) {
    const results = [];
    try {
        const user = await (0, authService_1.validateAuthentication)();
        results.push({
            key: 'auth:myself',
            title: 'Validação de autenticação (GET /myself)',
            status: 'pass',
            severity: 'info',
            message: `Autenticação OK. Usuário: ${user.displayName} (${user.accountId}).`,
            blocking: false,
            metadata: {
                accountId: user.accountId,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
            },
        });
    }
    catch (err) {
        results.push({
            key: 'auth:myself',
            title: 'Validação de autenticação (GET /myself)',
            status: 'fail',
            severity: 'critical',
            message: 'Falha ao autenticar no Jira usando /rest/api/3/myself. Verifique URL, email e API token.',
            details: [String(err?.message ?? err)],
            blocking: true,
        });
    }
    return results;
}
