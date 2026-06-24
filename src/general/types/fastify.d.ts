import 'fastify';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import type { EmployeeSessionModel } from 'src/app/entities/models/employeeSession/employeeSession.model';
import type { SessionModel } from 'src/app/entities/models/session/session.model';
import type { RequestContext } from 'src/general/managers/requestContext/requestContext.manager';

declare module 'fastify' {
  interface FastifyRequest {
    device?: DeviceModel;
    session?: SessionModel;
    employee?: EmployeeSessionModel;
    requestContext?: RequestContext;
  }
}
