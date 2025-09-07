import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import {
  IValidateHeadersController,
  ValidateHeadersControllerBuilder,
} from '../validateHeadersV1/validateHeaders.controller';

import { CreatePatientControllerBuilder, ICreatePatientController } from './createPatient.controller';

export class CreatePatientV1Router {
  private readonly version: string = '/v1';
  private readonly createPatientController: ICreatePatientController;
  private readonly validateHeadersController: IValidateHeadersController;

  constructor(private readonly fastify: FastifyInstance) {
    this.createPatientController = CreatePatientControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
      ),
      handler: this.createPatientController.handle.bind(this.createPatientController),
    });
  }
}
