import { jiraClient } from '../../clients/jiraClient';
import { agileClient } from '../../clients/agileClient';
import { ValidationCheckResult, ValidationContext } from '../types';

async function safeGet(url: string, useAgile = false): Promise<{ ok: boolean; status?: number; error?: any }> {
  try {
    const client = useAgile ? agileClient : jiraClient;
    const resp = await client.request({
      url,
      method: 'GET',
    });
    return { ok: true, status: resp.status };
  } catch (err: any) {
    const status = err?.response?.status;
    return { ok: false, status, error: err };
  }
}

export async function runEndpointCheck(ctx: ValidationContext): Promise<ValidationCheckResult[]> {
  const endpoints: Array<{ key: string; title: string; url: string; useAgile?: boolean; critical?: boolean }> = [
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

  const results: ValidationCheckResult[] = [];

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
    } else {
      const status = res.status;
      const isCritical = !!ep.critical;

      let statusLabel: 'warn' | 'fail' = 'warn';
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
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

