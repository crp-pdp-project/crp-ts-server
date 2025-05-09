import { FastifyInstance } from 'fastify';

import { PatientNextAppointmentBuilder } from 'src/app/controllers/patientNextAppointments/patientNextAppointment.builder';
import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { PatientCurrentAppointmentsBuilder } from '../../controllers/patientCurrentAppointments/patientCurrentAppointments.builder';
import { IPatientCurrentAppointmentsController } from '../../controllers/patientCurrentAppointments/patientCurrentAppointments.controller';
import { PatientHistoricAppointmentsBuilder } from '../../controllers/patientHistoricAppointments/patientHistoricAppointments.builder';
import { IPatientHistoricAppointmentsController } from '../../controllers/patientHistoricAppointments/patientHistoricAppointments.controller';

export class DashboardV1Router {
  private readonly version: string = '/v1';
  private readonly patientCurrentAppointmentsController: IPatientCurrentAppointmentsController;
  private readonly patientHistoricAppointmentsController: IPatientHistoricAppointmentsController;
  private readonly patientNextAppointmentController: IPatientCurrentAppointmentsController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientCurrentAppointmentsController = PatientCurrentAppointmentsBuilder.build();
    this.patientHistoricAppointmentsController = PatientHistoricAppointmentsBuilder.build();
    this.patientNextAppointmentController = PatientNextAppointmentBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildSession();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/appointment/current`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.patientCurrentAppointmentsController.handle.bind(this.patientCurrentAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/appointment/historic`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.patientHistoricAppointmentsController.handle.bind(this.patientHistoricAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/appointment/next`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.patientNextAppointmentController.handle.bind(this.patientNextAppointmentController),
    });
  }
}
