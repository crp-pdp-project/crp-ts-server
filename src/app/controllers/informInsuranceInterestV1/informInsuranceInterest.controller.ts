import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  IInformInsuranceInterestInteractor,
  InformInsuranceInterestInteractorBuilder,
} from 'src/app/interactors/informInsuranceInterest/informInsuranceInterest.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IInformInsuranceInterestController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class InformInsuranceInterestController implements IInformInsuranceInterestController {
  private response?: ResponseModel;

  constructor(
    private readonly insuranceInterest: IInformInsuranceInterestInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.insuranceInterest.inform(session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class InformInsuranceInterestControllerBuilder {
  static build(): InformInsuranceInterestController {
    return new InformInsuranceInterestController(
      InformInsuranceInterestInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
