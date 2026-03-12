"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPermissionCheck = runPermissionCheck;
const jiraClient_1 = require("../../clients/jiraClient");
const PERMISSIONS_TO_CHECK = [
    { key: 'ADMINISTER', label: 'Administrar Jira (global)', area: 'global' },
    { key: 'ADMINISTER_PROJECTS', label: 'Administrar projetos', area: 'project' },
    { key: 'BROWSE_PROJECTS', label: 'Visualizar projetos', area: 'project' },
    { key: 'CREATE_ISSUES', label: 'Criar issues', area: 'project' },
    { key: 'MANAGE_SPRINTS_PERMISSION', label: 'Gerenciar boards/sprints', area: 'board' },
];
async function runPermissionCheck(ctx) {
    const results = [];
    try {
        const permissionKeys = PERMISSIONS_TO_CHECK.map((p) => p.key).join(',');
        const resp = await jiraClient_1.jiraClient.request({
            url: `/mypermissions?permissions=${encodeURIComponent(permissionKeys)}`,
            method: 'GET',
        });
        const perms = resp.data.permissions || {};
        for (const permDef of PERMISSIONS_TO_CHECK) {
            const perm = perms[permDef.key];
            if (!perm) {
                // Não conseguimos provar presença/ausência -> warn, não pass
                results.push({
                    key: `perm:${permDef.key.toLowerCase()}`,
                    title: `Permissão ${permDef.label}`,
                    status: 'warn',
                    severity: 'medium',
                    message: 'Não foi possível determinar com segurança se a permissão está disponível via /mypermissions.',
                    blocking: false,
                });
                continue;
            }
            if (perm.havePermission) {
                results.push({
                    key: `perm:${permDef.key.toLowerCase()}`,
                    title: `Permissão ${permDef.label}`,
                    status: 'pass',
                    severity: 'info',
                    message: 'Permissão aparenta estar disponível para o usuário autenticado.',
                    blocking: false,
                });
            }
            else {
                // Permissão não disponível -> depende do tipo para ser bloqueante ou não
                const isCritical = permDef.key === 'ADMINISTER_PROJECTS' ||
                    permDef.key === 'ADMINISTER' ||
                    permDef.key === 'CREATE_ISSUES';
                results.push({
                    key: `perm:${permDef.key.toLowerCase()}`,
                    title: `Permissão ${permDef.label}`,
                    status: 'fail',
                    severity: isCritical ? 'high' : 'medium',
                    message: 'Usuário autenticado aparenta não possuir esta permissão.',
                    blocking: isCritical,
                });
            }
        }
    }
    catch (err) {
        results.push({
            key: 'perm:mypermissions-error',
            title: 'Leitura de permissões via /mypermissions',
            status: 'warn',
            severity: 'medium',
            message: 'Não foi possível ler permissões via /mypermissions. Não é possível afirmar com certeza se permissões mínimas existem.',
            details: [String(err?.message ?? err)],
            blocking: false,
        });
    }
    return results;
}
