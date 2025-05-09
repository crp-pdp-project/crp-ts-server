import 'dotenv/config';
import https from 'https';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import cors from '@fastify/cors';
import ejs from 'ejs';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { AppointmentV1Router } from 'src/app/routers/v1/appointments.router';
import { AuthenticationV1Router } from 'src/app/routers/v1/authentication.router';
import { DashboardV1Router } from 'src/app/routers/v1/dashboard.router';
import { EnrollV1Router } from 'src/app/routers/v1/enroll.router';
import { ProfileV1Router } from 'src/app/routers/v1/profile.router';
import { RecoverV1Router } from 'src/app/routers/v1/recover.router';
import { LoggerClient } from 'src/clients/logger.client';
import { DMDocs } from 'src/docs/dataModels.docs';
import { swaggerMeta } from 'src/docs/meta/swagger.meta';
import { AppointmentV1Docs } from 'src/docs/v1/appointments.docs';
import { AuthenticationV1Docs } from 'src/docs/v1/authentication.docs';
import { DashboardV1Docs } from 'src/docs/v1/dashboard.docs';
import { EnrollV1Docs } from 'src/docs/v1/enroll.docs';
import { ProfileV1Docs } from 'src/docs/v1/profile.docs';
import { RecoverV1Docs } from 'src/docs/v1/recover.docs';
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
    new EnrollV1Docs(this.manager).registerDocs();
    new RecoverV1Docs(this.manager).registerDocs();
    new AuthenticationV1Docs(this.manager).registerDocs();
    new ProfileV1Docs(this.manager).registerDocs();
    new DashboardV1Docs(this.manager).registerDocs();
    new AppointmentV1Docs(this.manager).registerDocs();
    new DMDocs(this.manager).registerDocs();
  }

  private static registerRoutes(): void {
    new EnrollV1Router(this.app).registerRouter();
    new RecoverV1Router(this.app).registerRouter();
    new AuthenticationV1Router(this.app).registerRouter();
    new ProfileV1Router(this.app).registerRouter();
    new DashboardV1Router(this.app).registerRouter();
    new AppointmentV1Router(this.app).registerRouter();
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
    https.globalAgent.options = {
      ...https.globalAgent.options,
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: Number(process.env.INETUM_TIMEOUT ?? 5000),
      checkServerIdentity: () => undefined,
    };
  }
}

void Server.start();

process.once('SIGINT', () => Server.shutdown());
process.once('SIGTERM', () => Server.shutdown());
