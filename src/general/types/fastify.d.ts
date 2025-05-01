import 'fastify';
import { SessionModel } from 'src/app/entities/models/session.model';

declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionModel;
  }
}
