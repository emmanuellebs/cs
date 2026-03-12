export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  module: string;
}

export class Logger {
  private module: string;

  constructor(options: LoggerOptions) {
    this.module = options.module;
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.module}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string): void {
    console.debug(this.format('debug', message));
  }

  info(message: string): void {
    console.info(this.format('info', message));
  }

  warn(message: string): void {
    console.warn(this.format('warn', message));
  }

  error(message: string, err?: unknown): void {
    const base = this.format('error', message);
    if (err instanceof Error) {
      console.error(`${base} | ${err.name}: ${err.message}`);
    } else if (err) {
      console.error(`${base} | ${JSON.stringify(err)}`);
    } else {
      console.error(base);
    }
  }
}

export const rootLogger = new Logger({ module: 'main' });

