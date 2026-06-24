import type { Logger, Level } from 'pino';
import pino from 'pino';

import { EnvHelper } from 'src/general/helpers/env.helper';
import { LogHelper } from 'src/general/helpers/log.helper';
import { RequestContextManager } from 'src/general/managers/requestContext/requestContext.manager';

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
    this.logger.info(this.resolveContext(context), message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(this.resolveContext(context), message);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(this.resolveContext(context), message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(this.resolveContext(context), message);
  }

  trace(message: string, context?: Record<string, unknown>): void {
    this.logger.trace(this.resolveContext(context), message);
  }

  log(level: Level, message: string, context?: Record<string, unknown>): void {
    this.logger[level](this.resolveContext(context), message);
  }

  private resolveContext(context?: Record<string, unknown>): Record<string, unknown> {
    return LogHelper.safeContext({
      ...(context ?? {}),
      ...RequestContextManager.getLogContext(),
    });
  }
}
