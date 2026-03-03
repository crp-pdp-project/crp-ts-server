import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import type { IValidateHeadersController } from '../validateHeadersV1/validateHeaders.controller';
import { ValidateHeadersControllerBuilder } from '../validateHeadersV1/validateHeaders.controller';
import type { IValidateSessionController } from '../validateSessionV1/validateSession.controller';
import { ValidateSessionControllerBuilder } from '../validateSessionV1/validateSession.controller';

import type { IAppointmentTypesListController } from './appointmentTypesList.controller';
import { AppointmentTypesListControllerBuilder } from './appointmentTypesList.controller';

export class AppointmentTypesListV1Router {
  private readonly version: string = '/v1';
  private readonly appointmentTypesListController: IAppointmentTypesListController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.appointmentTypesListController = AppointmentTypesListControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/appointment-types`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.appointmentTypesListController.handle.bind(this.appointmentTypesListController),
    });
  }
}
