import 'dotenv/config';
import https from 'https';

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
import { CRPConstants } from 'src/general/contants/crp.constants';
import { Environments } from 'src/general/enums/environments.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { OpenApiManager } from 'src/general/managers/openapi/openapi.manager';
import swaggerMeta from 'src/general/static/swaggerMeta.static';
import swaggerTemplate from 'src/general/templates/swagger.template';

export class Server {
  private static readonly app: FastifyInstance = Fastify({ logger: false, trustProxy: true });
  private static readonly registry: OpenAPIRegistry = new OpenAPIRegistry();
  private static readonly manager: OpenApiManager = new OpenApiManager(this.registry);
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly port: number = Number(EnvHelper.get('NODE_PORT'));

  static async start(): Promise<void> {
    try {
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

  static async shutdown(fatal = false): Promise<void> {
    try {
      await this.app.close();
      this.logger.info('Server closed gracefully');
      process.exit(fatal ? 1 : 0);
    } catch (error) {
      this.logger.error('Error during shutdown', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
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
    this.app.addHook('preHandler', async (request: FastifyRequest) => {
      this.logger.info('Incoming Request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        body: request.body ?? {},
        query: request.query ?? {},
        path: request.params ?? {},
        headers: request.headers ?? {},
      });
    });

    this.app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload) => {
      this.logger.info('Response Sent', {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        response: this.parseResponsePayload(payload),
      });

      return payload;
    });

    this.app.addHook('onRequest', async (_, reply) => {
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
}

void Server.start();

process.once('SIGINT', () => Server.shutdown());
process.once('SIGTERM', () => Server.shutdown());

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
  setImmediate(() => Server.shutdown(true));
});
