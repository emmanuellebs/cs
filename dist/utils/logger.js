"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootLogger = exports.Logger = void 0;
class Logger {
    constructor(options) {
        this.module = options.module;
    }
    format(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${this.module}] [${level.toUpperCase()}] ${message}`;
    }
    debug(message) {
        console.debug(this.format('debug', message));
    }
    info(message) {
        console.info(this.format('info', message));
    }
    warn(message) {
        console.warn(this.format('warn', message));
    }
    error(message, err) {
        const base = this.format('error', message);
        if (err instanceof Error) {
            console.error(`${base} | ${err.name}: ${err.message}`);
        }
        else if (err) {
            console.error(`${base} | ${JSON.stringify(err)}`);
        }
        else {
            console.error(base);
        }
    }
}
exports.Logger = Logger;
exports.rootLogger = new Logger({ module: 'main' });
