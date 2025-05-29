import { FastifyInstance } from 'fastify';

import { AvailabilityListBuilder } from 'src/app/controllers/availabilityList/availabilityList.builder';
import { IAvailabilityListController } from 'src/app/controllers/availabilityList/availabilityList.controller';
import { CreateAppointmentBuilder } from 'src/app/controllers/createAppointment/createAppointment.builder';
import { ICreateAppointmentController } from 'src/app/controllers/createAppointment/createAppointment.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { AppointmentTypesListBuilder } from '../../controllers/appointmentTypesList/appointmentTypesList.builder';
import { IAppointmentTypesListController } from '../../controllers/appointmentTypesList/appointmentTypesList.controller';
import { DoctorsListBuilder } from '../../controllers/doctorsList/doctorsList.builder';
import { IDoctorsListController } from '../../controllers/doctorsList/doctorsList.controller';
import { InsurancesListBuilder } from '../../controllers/insurancesList/insurancesList.builder';
import { IInsurancesListController } from '../../controllers/insurancesList/insurancesList.controller';
import { PatientRelativesBuilder } from '../../controllers/patientRelatives/patientRelatives.builder';
import { IPatientRelativesController } from '../../controllers/patientRelatives/patientRelatives.controller';
import { SpecialtiesListBuilder } from '../../controllers/specialtiesList/specialtiesList.builder';
import { ISpecialtiesListController } from '../../controllers/specialtiesList/specialtiesList.controller';
import { BaseRouter } from '../base.router';

export class AppointmentV1Router extends BaseRouter {
  private readonly doctorsListController: IDoctorsListController;
  private readonly specialtiesListController: ISpecialtiesListController;
  private readonly insurancesListController: IInsurancesListController;
  private readonly appointmentTypesListController: IAppointmentTypesListController;
  private readonly patientRelativesController: IPatientRelativesController;
  private readonly availabilityListController: IAvailabilityListController;
  private readonly createAppointmentController: ICreateAppointmentController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.doctorsListController = DoctorsListBuilder.build();
    this.specialtiesListController = SpecialtiesListBuilder.build();
    this.insurancesListController = InsurancesListBuilder.build();
    this.appointmentTypesListController = AppointmentTypesListBuilder.build();
    this.patientRelativesController = PatientRelativesBuilder.build();
    this.availabilityListController = AvailabilityListBuilder.build();
    this.createAppointmentController = CreateAppointmentBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/doctors`,
      preHandler: this.validatePatientSession(),
      handler: this.doctorsListController.handle.bind(this.doctorsListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/specialties`,
      preHandler: this.validatePatientSession(),
      handler: this.specialtiesListController.handle.bind(this.specialtiesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/insurances`,
      preHandler: this.validatePatientSession(),
      handler: this.insurancesListController.handle.bind(this.insurancesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/appointment-types`,
      preHandler: this.validatePatientSession(),
      handler: this.appointmentTypesListController.handle.bind(this.appointmentTypesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/patients/relatives`,
      preHandler: this.validatePatientSession(),
      handler: this.patientRelativesController.handle.bind(this.patientRelativesController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/doctors/availability`,
      preHandler: this.validatePatientSession(),
      handler: this.availabilityListController.handle.bind(this.availabilityListController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/:fmpId/appointments`,
      preHandler: this.validatePatientSession(),
      handler: this.createAppointmentController.handle.bind(this.createAppointmentController),
    });
  }
}
