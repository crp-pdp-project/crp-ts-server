import { FastifyReply, FastifyRequest } from 'fastify';

import { HealthInsuranceViewOutputDTOSchema } from 'src/app/entities/dtos/output/healthInsuranceView.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  HealthInsuranceViewInteractorBuilder,
  IHealthInsuranceViewInteractor,
} from 'src/app/interactors/healthInsuranceView/healthInsuranceView.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IHealthInsuranceViewController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class HealthInsuranceViewController implements IHealthInsuranceViewController {
  private response?: ResponseModel;

  constructor(
    private readonly healthInsuranceInteractor: IHealthInsuranceViewInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.healthInsuranceInteractor.getView();
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class HealthInsuranceViewControllerBuilder {
  static build(): HealthInsuranceViewController {
    return new HealthInsuranceViewController(
      HealthInsuranceViewInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(HealthInsuranceViewOutputDTOSchema),
    );
  }
}
