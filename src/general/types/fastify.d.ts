import 'fastify';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';

declare module 'fastify' {
  interface FastifyRequest {
    device?: DeviceModel;
    session?: SessionModel;
  }
}
