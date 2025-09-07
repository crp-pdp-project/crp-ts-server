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

import { IPatientApointmentsController, PatientApointmentsControllerBuilder } from './patientAppointments.controller';

export class PatientAppointmentsV1Router {
  private readonly version: string = '/v1';
  private readonly patientCurrentAppointmentsController: IPatientApointmentsController;
  private readonly patientHistoricAppointmentsController: IPatientApointmentsController;
  private readonly patientNextAppointmentController: IPatientApointmentsController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientCurrentAppointmentsController = PatientApointmentsControllerBuilder.buildCurrent();
    this.patientHistoricAppointmentsController = PatientApointmentsControllerBuilder.buildHistoric();
    this.patientNextAppointmentController = PatientApointmentsControllerBuilder.buildNext();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:fmpId/appointment/current`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.patientCurrentAppointmentsController.handle.bind(this.patientCurrentAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:fmpId/appointment/historic`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.patientHistoricAppointmentsController.handle.bind(this.patientHistoricAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:fmpId/appointment/next`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.patientNextAppointmentController.handle.bind(this.patientNextAppointmentController),
    });
  }
}
