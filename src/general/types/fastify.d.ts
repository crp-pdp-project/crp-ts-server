import 'fastify';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import type { SessionModel } from 'src/app/entities/models/session/session.model';

declare module 'fastify' {
  interface FastifyRequest {
    device?: DeviceModel;
    session?: SessionModel;
    employee?: EmployeeSessionModel;
  }
}
