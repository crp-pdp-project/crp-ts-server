import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PayHealthInsuranceBodyDTOSchema,
  PayHealthInsuranceInputDTO,
} from 'src/app/entities/dtos/input/payHealthInsurance.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  IPayHealthInsuranceInteractor,
  PayHealthInsuranceInteractorBuilder,
} from 'src/app/interactors/payHealthInsurance/payHealthInsurance.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPayHealthInsuranceController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PayHealthInsuranceController implements IPayHealthInsuranceController {
  private response?: ResponseModel;

  constructor(
    private readonly payHealthInsurance: IPayHealthInsuranceInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PayHealthInsuranceInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = PayHealthInsuranceBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      await this.payHealthInsurance.pay(body, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PayHealthInsuranceControllerBuilder {
  static build(): PayHealthInsuranceController {
    return new PayHealthInsuranceController(
      PayHealthInsuranceInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
