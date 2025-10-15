import { FastifyReply, FastifyRequest } from 'fastify';

import { InsurancesListOutputDTOSchema } from 'src/app/entities/dtos/output/insurancesList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IInsurancesListInteractor,
  InsurancesListInteractorBuilder,
} from 'src/app/interactors/insurancesList/insurancesList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IInsurancesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class InsurancesListController implements IInsurancesListController {
  private response?: ResponseModel;

  constructor(
    private readonly insuranceInteractor: IInsurancesListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.insuranceInteractor.list();
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class InsurancesListControllerBuilder {
  static build(): InsurancesListController {
    return new InsurancesListController(
      InsurancesListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(InsurancesListOutputDTOSchema),
    );
  }
}
