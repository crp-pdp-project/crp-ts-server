import { FastifyInstance } from 'fastify';

import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { AppointmentTypesListBuilder } from '../controllers/appointmentTypesList/appointmentTypesList.builder';
import { IAppointmentTypesListController } from '../controllers/appointmentTypesList/appointmentTypesList.controller';
import { DoctorsListBuilder } from '../controllers/doctorsList/doctorsList.builder';
import { IDoctorsListController } from '../controllers/doctorsList/doctorsList.controller';
import { InsurancesListBuilder } from '../controllers/insurancesList/insurancesList.builder';
import { IInsurancesListController } from '../controllers/insurancesList/insurancesList.controller';
import { PatientRelativesBuilder } from '../controllers/patientRelatives/patientRelatives.builder';
import { IPatientRelativesController } from '../controllers/patientRelatives/patientRelatives.controller';
import { SpecialtiesListBuilder } from '../controllers/specialtiesList/specialtiesList.builder';
import { ISpecialtiesListController } from '../controllers/specialtiesList/specialtiesList.controller';

export class CitationRouter {
  private readonly doctorsListController: IDoctorsListController;
  private readonly specialtiesListController: ISpecialtiesListController;
  private readonly insurancesListController: IInsurancesListController;
  private readonly appointmentTypesListController: IAppointmentTypesListController;
  private readonly patientRelativesController: IPatientRelativesController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.doctorsListController = DoctorsListBuilder.build();
    this.specialtiesListController = SpecialtiesListBuilder.build();
    this.insurancesListController = InsurancesListBuilder.build();
    this.appointmentTypesListController = AppointmentTypesListBuilder.build();
    this.patientRelativesController = PatientRelativesBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildSession();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/doctors',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.doctorsListController.handle.bind(this.doctorsListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/specialties',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.specialtiesListController.handle.bind(this.specialtiesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/insurances',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.insurancesListController.handle.bind(this.insurancesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/appointment-types',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.appointmentTypesListController.handle.bind(this.appointmentTypesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: '/patients/relatives',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.patientRelativesController.handle.bind(this.patientRelativesController),
    });
  }
}
