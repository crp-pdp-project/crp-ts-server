import { FastifyInstance } from 'fastify';

import { PatientNextAppointmentBuilder } from 'src/app/controllers/patientNextAppointments/patientNextAppointment.builder';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { PatientCurrentAppointmentsBuilder } from '../../controllers/patientCurrentAppointments/patientCurrentAppointments.builder';
import { IPatientCurrentAppointmentsController } from '../../controllers/patientCurrentAppointments/patientCurrentAppointments.controller';
import { PatientHistoricAppointmentsBuilder } from '../../controllers/patientHistoricAppointments/patientHistoricAppointments.builder';
import { IPatientHistoricAppointmentsController } from '../../controllers/patientHistoricAppointments/patientHistoricAppointments.controller';
import { BaseRouter } from '../base.router';

export class DashboardV1Router extends BaseRouter {
  private readonly patientCurrentAppointmentsController: IPatientCurrentAppointmentsController;
  private readonly patientHistoricAppointmentsController: IPatientHistoricAppointmentsController;
  private readonly patientNextAppointmentController: IPatientCurrentAppointmentsController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.patientCurrentAppointmentsController = PatientCurrentAppointmentsBuilder.build();
    this.patientHistoricAppointmentsController = PatientHistoricAppointmentsBuilder.build();
    this.patientNextAppointmentController = PatientNextAppointmentBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/patients/:fmpId/appointment/current`,
      preHandler: this.validatePatientSession(),
      handler: this.patientCurrentAppointmentsController.handle.bind(this.patientCurrentAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/patients/:fmpId/appointment/historic`,
      preHandler: this.validatePatientSession(),
      handler: this.patientHistoricAppointmentsController.handle.bind(this.patientHistoricAppointmentsController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/patients/:fmpId/appointment/next`,
      preHandler: this.validatePatientSession(),
      handler: this.patientNextAppointmentController.handle.bind(this.patientNextAppointmentController),
    });
  }
}
