"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEndpointCheck = runEndpointCheck;
const jiraClient_1 = require("../../clients/jiraClient");
const agileClient_1 = require("../../clients/agileClient");
async function safeGet(url, useAgile = false) {
    try {
        const client = useAgile ? agileClient_1.agileClient : jiraClient_1.jiraClient;
        const resp = await client.request({
            url,
            method: 'GET',
        });
        return { ok: true, status: resp.status };
    }
    catch (err) {
        const status = err?.response?.status;
        return { ok: false, status, error: err };
    }
}
async function runEndpointCheck(ctx) {
    const endpoints = [
        {
            key: 'endpoint:myself',
            title: 'Endpoint /rest/api/3/myself',
            url: '/myself',
            critical: true,
        },
        {
            key: 'endpoint:issuetype',
            title: 'Endpoint /rest/api/3/issuetype',
            url: '/issuetype',
            critical: true,
        },
        {
            key: 'endpoint:field',
            title: 'Endpoint /rest/api/3/field',
            url: '/field',
            critical: true,
        },
        {
            key: 'endpoint:filter-search',
            title: 'Endpoint /rest/api/3/filter/search',
            url: '/filter/search?filterName=CSM-preflight-test',
            critical: false,
        },
        {
            key: 'endpoint:dashboard',
            title: 'Endpoint /rest/api/3/dashboard',
            url: '/dashboard',
            critical: false,
        },
        {
            key: 'endpoint:agile-board',
            title: 'Endpoint /rest/agile/1.0/board',
            url: '/board',
            useAgile: true,
            critical: false,
        },
    ];
    const results = [];
    for (const ep of endpoints) {
        const res = await safeGet(ep.url, ep.useAgile);
        if (res.ok) {
            results.push({
                key: ep.key,
                title: ep.title,
                status: 'pass',
                severity: 'info',
                message: `Endpoint respondeu com status ${res.status}.`,
                blocking: false,
            });
        }
        else {
            const status = res.status;
            const isCritical = !!ep.critical;
            let statusLabel = 'warn';
            let severity = 'medium';
            let blocking = false;
            if (!status || status >= 500 || status === 401 || status === 403) {
                statusLabel = 'fail';
                severity = isCritical ? 'critical' : 'high';
                blocking = !!isCritical;
            }
            results.push({
                key: ep.key,
                title: ep.title,
                status: statusLabel,
                severity,
                message: `Falha ao acessar endpoint (${status ?? 'sem status HTTP'}).`,
                details: res.error ? [String(res.error?.message ?? res.error)] : undefined,
                blocking,
            });
        }
    }
    return results;
}
