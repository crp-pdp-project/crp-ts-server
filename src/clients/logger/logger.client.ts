import pino, { Logger, Level } from 'pino';

import { EnvHelper } from 'src/general/helpers/env.helper';

export class LoggerClient {
  static readonly instance: LoggerClient = new LoggerClient();
  private readonly logger: Logger;

  private constructor() {
    this.logger = pino({
      level: EnvHelper.getCurrentLogLevel(),
      base: { service: 'crp-ts-app' },
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level(label) {
          return { level: label };
        },
      },
    });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(context ?? {}, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(context ?? {}, message);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(context ?? {}, message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(context ?? {}, message);
  }

  trace(message: string, context?: Record<string, unknown>): void {
    this.logger.trace(context ?? {}, message);
  }

  log(level: Level, message: string, context?: Record<string, unknown>): void {
    this.logger[level](context ?? {}, message);
  }
}
