import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { JiraEnvConfig, loadJiraEnvConfig } from '../config/envConfig';
import { loadRuntimeConfig } from '../config/runtimeConfig';
import { Logger } from '../utils/logger';

const logger = new Logger({ module: 'jiraClient' });

interface JiraRequestOptions {
  allowWriteInAuditMode?: boolean;
}

export class JiraClient {
  private axios: AxiosInstance;
  private env: JiraEnvConfig;
  private mode = loadRuntimeConfig();

  constructor() {
    this.env = loadJiraEnvConfig();
    const authToken = Buffer.from(`${this.env.email}:${this.env.apiToken}`).toString('base64');

    this.axios = axios.create({
      baseURL: `${this.env.baseUrl}/rest/api/3`,
      headers: {
        Authorization: `Basic ${authToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  getEnvironment(): JiraEnvConfig {
    return this.env;
  }

  getMode() {
    return this.mode;
  }

  async request<T = any>(
    config: AxiosRequestConfig,
    options: JiraRequestOptions = {}
  ): Promise<AxiosResponse<T>> {
    const method = (config.method || 'get').toLowerCase();
    const isWrite = ['post', 'put', 'delete', 'patch'].includes(method);

    if (isWrite) {
      if (this.mode.mode === 'audit' && !options.allowWriteInAuditMode) {
        logger.info(
          `AUDIT-ONLY: requisição de escrita ignorada (${method.toUpperCase()} ${config.url}).`
        );
        return {
          data: {} as T,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as any,
        };
      }

      if (this.mode.dryRun) {
        logger.info(
          `DRY-RUN: não enviando requisição de escrita (${method.toUpperCase()} ${config.url}).`
        );
        return {
          data: {} as T,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as any,
        };
      }
    }

    try {
      logger.debug(`${method.toUpperCase()} ${config.url}`);
      const response = await this.axios.request<T>(config);
      return response;
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      logger.error(
        `Erro ao chamar Jira API (${method.toUpperCase()} ${config.url}) - status: ${status}`,
        data || error
      );
      throw error;
    }
  }
}

export const jiraClient = new JiraClient();

