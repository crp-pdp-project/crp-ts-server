import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';
import {
  IValidateSessionController,
  ValidateSessionControllerBuilder,
} from '../validateSessionV1/validateSession.controller';

import {
  RescheduleAppointmentControllerBuilder,
  IRescheduleAppointmentController,
} from './rescheduleAppointment.controller';

export class RescheduleAppointmentV1Router {
  private readonly version: string = '/v1';
  private readonly rescheduleAppointment: IRescheduleAppointmentController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.rescheduleAppointment = RescheduleAppointmentControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patients/:fmpId/appointments/:appointmentId`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.rescheduleAppointment.handle.bind(this.rescheduleAppointment),
    });
  }
}
