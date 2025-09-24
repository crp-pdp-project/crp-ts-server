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

import { HealthInsuranceViewControllerBuilder, IHealthInsuranceViewController } from './healthInsuranceView.controller';

export class HealthInsuranceViewV1Router {
  private readonly version: string = '/v1';
  private readonly healthInsuranceViewController: IHealthInsuranceViewController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.healthInsuranceViewController = HealthInsuranceViewControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/health-insurances/view`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.healthInsuranceViewController.handle.bind(this.healthInsuranceViewController),
    });
  }
}
