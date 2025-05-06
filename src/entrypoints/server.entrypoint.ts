import 'dotenv/config';
import https from 'https';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import cors from '@fastify/cors';
import ejs from 'ejs';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { AuthenticationRouter } from 'src/app/routers/authentication.router';
import { CitationRouter } from 'src/app/routers/citation.router';
import { DashboardRouter } from 'src/app/routers/dashboard.router';
import { EnrollRouter } from 'src/app/routers/enroll.router';
import { ProfileRouter } from 'src/app/routers/profile.router';
import { RecoverRouter } from 'src/app/routers/recover.router';
import { LoggerClient } from 'src/clients/logger.client';
import { AuthenticationDocs } from 'src/docs/authentication.docs';
import { CitationDocs } from 'src/docs/citation.docs';
import { DashboardDocs } from 'src/docs/dashboard.docs';
import { DMDocs } from 'src/docs/dataModels.docs';
import { EnrollDocs } from 'src/docs/enroll.docs';
import { swaggerMeta } from 'src/docs/meta/swagger.meta';
import { ProfileDocs } from 'src/docs/profile.docs';
import { RecoverDocs } from 'src/docs/recover.docs';
import { OpenApiManager } from 'src/general/managers/openapi.manager';
import swaggerTemplate from 'src/general/templates/swagger.template';

export class Server {
  private static readonly app: FastifyInstance = Fastify({ logger: false });
  private static readonly registry: OpenAPIRegistry = new OpenAPIRegistry();
  private static readonly manager: OpenApiManager = new OpenApiManager(this.registry);
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly port: number = Number(process.env.NODE_PORT ?? 3000);

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

  static async shutdown(): Promise<void> {
    try {
      await this.app.close();
      this.logger.info('Server closed gracefully');
      process.exit(0);
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
    this.registerDocs();
    this.registerRoutes();
    this.setupHttpClient();
    await this.setupDocsEndpoint();
    await this.app.register(cors);
  }

  private static registerHooks(): void {
    this.app.addHook('onRequest', async (request: FastifyRequest) => {
      this.logger.info('Incoming Request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      });
    });

    this.app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
      this.logger.info('Response Sent', {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
      });
    });
  }

  private static registerDocs(): void {
    new EnrollDocs(this.manager).registerDocs();
    new RecoverDocs(this.manager).registerDocs();
    new AuthenticationDocs(this.manager).registerDocs();
    new ProfileDocs(this.manager).registerDocs();
    new DashboardDocs(this.manager).registerDocs();
    new CitationDocs(this.manager).registerDocs();
    new DMDocs(this.manager).registerDocs();
  }

  private static registerRoutes(): void {
    new EnrollRouter(this.app).registerRouter();
    new RecoverRouter(this.app).registerRouter();
    new AuthenticationRouter(this.app).registerRouter();
    new ProfileRouter(this.app).registerRouter();
    new DashboardRouter(this.app).registerRouter();
    new CitationRouter(this.app).registerRouter();
  }

  private static async setupDocsEndpoint(): Promise<void> {
    const generator = new OpenApiGeneratorV3(this.registry.definitions);

    this.app.get('/docs', async (_, reply) => {
      const spec = generator.generateDocument(swaggerMeta);
      const encodedSpec = encodeURIComponent(JSON.stringify(spec));

      const html = ejs.render(swaggerTemplate, {
        openApi: encodedSpec,
        title: `${swaggerMeta.info.title} - Docs`,
      });

      reply.type('text/html').send(html);
    });
  }

  private static setupHttpClient(): void {
    https.globalAgent.options.rejectUnauthorized = false;
    https.globalAgent.options.checkServerIdentity = () => undefined;
  }
}

void Server.start();

process.once('SIGINT', () => Server.shutdown());
process.once('SIGTERM', () => Server.shutdown());
