"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agileClient = exports.AgileClient = void 0;
const axios_1 = __importDefault(require("axios"));
const envConfig_1 = require("../config/envConfig");
const runtimeConfig_1 = require("../config/runtimeConfig");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger({ module: 'agileClient' });
class AgileClient {
    constructor() {
        this.mode = (0, runtimeConfig_1.loadRuntimeConfig)();
        const env = (0, envConfig_1.loadJiraEnvConfig)();
        const authToken = Buffer.from(`${env.email}:${env.apiToken}`).toString('base64');
        this.axios = axios_1.default.create({
            baseURL: `${env.baseUrl}/rest/agile/1.0`,
            headers: {
                Authorization: `Basic ${authToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    getMode() {
        return this.mode;
    }
    async request(config, options = {}) {
        const method = (config.method || 'get').toLowerCase();
        const isWrite = ['post', 'put', 'delete', 'patch'].includes(method);
        if (isWrite) {
            if (this.mode.mode === 'audit' && !options.allowWriteInAuditMode) {
                logger.info(`AUDIT-ONLY: requisição de escrita ignorada (${method.toUpperCase()} ${config.url}).`);
                return {
                    data: {},
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: config,
                };
            }
            if (this.mode.dryRun) {
                logger.info(`DRY-RUN: não enviando requisição de escrita (${method.toUpperCase()} ${config.url}).`);
                return {
                    data: {},
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: config,
                };
            }
        }
        try {
            logger.debug(`${method.toUpperCase()} ${config.url}`);
            const response = await this.axios.request(config);
            return response;
        }
        catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;
            logger.error(`Erro ao chamar Jira Agile API (${method.toUpperCase()} ${config.url}) - status: ${status}`, data || error);
            throw error;
        }
    }
}
exports.AgileClient = AgileClient;
exports.agileClient = new AgileClient();
