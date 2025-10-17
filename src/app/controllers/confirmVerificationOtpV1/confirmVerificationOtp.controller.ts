import { FastifyReply, FastifyRequest } from 'fastify';

import {
  ConfirmVerificationOTPBodyDTOSchema,
  ConfirmVerificationOTPInputDTO,
} from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  ConfirmVerificationOTPInteractorBuilder,
  IConfirmVerificationOTPInteractor,
} from 'src/app/interactors/confirmVerificationOtp/confirmVerificationOtp.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IConfirmVerificationOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ConfirmVerificationOTPController implements IConfirmVerificationOTPController {
  private response?: ResponseModel;

  constructor(
    private readonly confirmVerificationOTP: IConfirmVerificationOTPInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<ConfirmVerificationOTPInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = ConfirmVerificationOTPBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateRawSession(input.session);
      await this.confirmVerificationOTP.confirm(body, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class ConfirmVerificationOTPControllerBuilder {
  static buildEnroll(): ConfirmVerificationOTPController {
    return new ConfirmVerificationOTPController(
      ConfirmVerificationOTPInteractorBuilder.buildEnroll(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }

  static buildRecover(): ConfirmVerificationOTPController {
    return new ConfirmVerificationOTPController(
      ConfirmVerificationOTPInteractorBuilder.buildRecover(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }

  static buildAuth(): ConfirmVerificationOTPController {
    return new ConfirmVerificationOTPController(
      ConfirmVerificationOTPInteractorBuilder.buildAuth(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
