import 'dotenv/config';
import https from 'https';
import { randomUUID } from 'node:crypto';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import ejs from 'ejs';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';

import { DocsBuilder } from 'src/app/controllers/docs.builder';
import { RouterBuilder } from 'src/app/controllers/router.builder';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { CRPConstants } from 'src/general/constants/crp.constants';
import { Environments } from 'src/general/enums/environments.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { TextHelper } from 'src/general/helpers/text.helper';
import { OpenApiManager } from 'src/general/managers/openapi/openapi.manager';
import { RequestContextManager } from 'src/general/managers/requestContext/requestContext.manager';
import swaggerMeta from 'src/general/static/swaggerMeta.static';
import swaggerTemplate from 'src/general/templates/swagger.template';

type ShutdownContext = {
  fatal?: boolean;
  reason?: string;
  details?: Record<string, unknown>;
};

export class Server {
  private static readonly app: FastifyInstance = Fastify({ logger: false, trustProxy: true });
  private static readonly registry: OpenAPIRegistry = new OpenAPIRegistry();
  private static readonly manager: OpenApiManager = new OpenApiManager(this.registry);
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly port: number = Number(EnvHelper.get('NODE_PORT'));
  private static readonly startedAt: number = Date.now();
  private static isShuttingDown = false;

  static async start(): Promise<void> {
    try {
      this.logRuntimeDiagnostics();
      await this.setup();
      await this.app.listen({ host: '0.0.0.0', port: this.port });
      this.logger.info(`Server running on port ${this.port}`);
    } catch (error) {
      this.logger.error('Server failed on startup', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  static async shutdown(context: ShutdownContext = {}): Promise<void> {
    const { fatal = false, reason = 'unknown', details = {} } = context;

    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress', {
        fatal,
        reason,
        ...details,
        ...this.getProcessDiagnostics(),
      });
      return;
    }

    this.isShuttingDown = true;

    try {
      await this.app.close();
      this.logger.info('Server closed gracefully', {
        fatal,
        reason,
        ...details,
        ...this.getProcessDiagnostics(),
      });
      process.exit(fatal ? 1 : 0);
    } catch (error) {
      this.logger.error('Error during shutdown', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  private static logRuntimeDiagnostics(): void {
    this.logger.info('Server runtime diagnostics', {
      nodeEnv: EnvHelper.getCurrentEnv(),
      nodeVersion: process.version,
      pid: process.pid,
      ppid: process.ppid,
      pmId: process.env.pm_id,
      pmExecPath: process.env.pm_exec_path,
      nodeAppInstance: process.env.NODE_APP_INSTANCE,
    });
  }

  private static getProcessDiagnostics(): Record<string, unknown> {
    return {
      pid: process.pid,
      uptimeSeconds: Math.round(process.uptime()),
      processAgeMs: Date.now() - this.startedAt,
      memoryUsage: process.memoryUsage(),
      resourceUsage: process.resourceUsage(),
    };
  }

  private static async setup(): Promise<void> {
    this.registerHooks();
    RouterBuilder.build(this.app);
    DocsBuilder.build(this.manager);
    await this.app.register(cors, {
      origin: true,
      credentials: false,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Os', 'X-Device-Id', 'X-Device-Name', 'X-Push-Token'],
      maxAge: 86400,
    });
    this.app.register(formbody);
    this.app.server.setTimeout(CRPConstants.REQUEST_TIMEOUT);
    this.app.server.requestTimeout = CRPConstants.REQUEST_TIMEOUT;

    if (EnvHelper.getCurrentEnv() !== Environments.PRD) {
      this.setupDocsEndpoint();
      this.setupHttpClient();
    }
  }

  private static registerHooks(): void {
    this.app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
      request.requestContext = {
        requestId: randomUUID(),
        requestMethod: request.method,
        requestUrl: TextHelper.stripQueryString(request.url),
        startedAt: DateHelper.toDate('none').valueOf(),
      };
      RequestContextManager.enter(request.requestContext);

      const timer = setTimeout(() => {
        if (!reply.sent) {
          const error = ErrorModel.timeout({ message: 'Request timeout' });
          const response = new ResponseModel(error);
          reply.code(response.statusCode).send(response.body);
        }
      }, CRPConstants.REQUEST_TIMEOUT);
      reply.raw.once('close', () => clearTimeout(timer));
      reply.raw.once('finish', () => clearTimeout(timer));
    });

    this.app.addHook('preHandler', async (request: FastifyRequest) => {
      this.ensureRequestContext(request);
      this.logger.info('Incoming Request', {
        method: request.method,
        url: TextHelper.stripQueryString(request.url),
        ip: request.ip,
        body: request.body ?? {},
        query: request.query ?? {},
        path: request.params ?? {},
        headers: request.headers ?? {},
      });
    });

    this.app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload) => {
      this.ensureRequestContext(request);
      this.logger.info('Response Sent', {
        method: request.method,
        url: TextHelper.stripQueryString(request.url),
        statusCode: reply.statusCode,
        durationMs: this.resolveDurationMs(request),
        response: this.parseResponsePayload(payload),
      });

      return payload;
    });
  }

  private static setupDocsEndpoint(): void {
    const generator = new OpenApiGeneratorV3(this.registry.definitions);

    this.app.get('/docs', async (_, reply) => {
      const html = ejs.render(swaggerTemplate, {
        title: `${swaggerMeta.info.title} - Docs`,
      });

      reply.type('text/html').send(html);
    });

    this.app.get('/docs/spec.json', async (_, reply) => {
      const spec = generator.generateDocument(swaggerMeta);

      reply.type('application/json').send(spec);
    });
  }

  private static setupHttpClient(): void {
    https.globalAgent.options = {
      ...https.globalAgent.options,
      rejectUnauthorized: false,
      keepAlive: true,
      checkServerIdentity: () => undefined,
    };
  }

  private static parseResponsePayload(payload: unknown): unknown {
    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload) as unknown;
      } catch {
        return payload;
      }
    }

    return null;
  }

  private static ensureRequestContext(request: FastifyRequest): void {
    if (request.requestContext) RequestContextManager.enter(request.requestContext);
  }

  private static resolveDurationMs(request: FastifyRequest): number | undefined {
    const durationMs = RequestContextManager.getDurationMs();
    if (durationMs !== undefined) return durationMs;
    if (!request.requestContext) return undefined;

    return DateHelper.toDate('none').valueOf() - request.requestContext.startedAt;
  }
}

void Server.start();

process.once('SIGINT', (signal) => {
  void Server.shutdown({ reason: 'signal', details: { signal } });
});

process.once('SIGTERM', (signal) => {
  void Server.shutdown({ reason: 'signal', details: { signal } });
});

process.on('unhandledRejection', (err) => {
  LoggerClient.instance.error('Unhandled promise rejection', {
    err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err),
  });
});

process.on('uncaughtException', (err) => {
  LoggerClient.instance.error('Uncaught exception', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  setImmediate(() => {
    void Server.shutdown({
      fatal: true,
      reason: 'uncaughtException',
      details: { name: err.name, message: err.message, stack: err.stack },
    });
  });
});

process.on('warning', (warning) => {
  LoggerClient.instance.warn('Process warning', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack,
  });
});

process.on('beforeExit', (code) => {
  LoggerClient.instance.warn('Process beforeExit', { code });
});

process.on('exit', (code) => {
  LoggerClient.instance.warn('Process exit', { code });
});
