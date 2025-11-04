import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateEmployeeSessionController,
  ValidateEmployeeSessionControllerBuilder,
} from '../validateEmployeeSessionV1/validateEmployeeSession.controller';

import { IPatientsListController, PatientsListControllerBuilder } from './patientsList.controller';

export class PatientsListV1Router {
  private readonly version: string = '/v1';
  private readonly patientsListController: IPatientsListController;
  private readonly relativesListController: IPatientsListController;
  private readonly verificationsListController: IPatientsListController;
  private readonly validateEmployeeSessionController: IValidateEmployeeSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientsListController = PatientsListControllerBuilder.buildPrincipal();
    this.relativesListController = PatientsListControllerBuilder.buildRelative();
    this.verificationsListController = PatientsListControllerBuilder.buildVerification();
    this.validateEmployeeSessionController = ValidateEmployeeSessionControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.patientsListController.handle.bind(this.patientsListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/:patientId/relatives`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.relativesListController.handle.bind(this.relativesListController),
    });
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/relatives/requests`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateEmployeeSessionController.validate.bind(this.validateEmployeeSessionController),
      ),
      handler: this.verificationsListController.handle.bind(this.verificationsListController),
    });
  }
}
