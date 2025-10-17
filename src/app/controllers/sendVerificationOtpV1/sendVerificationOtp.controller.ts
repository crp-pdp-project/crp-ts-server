import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  ISendVerificationOTPInteractor,
  SendVerificationOTPInteractorBuilder,
} from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISendVerificationOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SendVerificationOTPController implements ISendVerificationOTPController {
  private response?: ResponseModel;

  constructor(
    private readonly sendOTPInteractor: ISendVerificationOTPInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateRawSession(input.session);
      await this.sendOTPInteractor.sendOTP(session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SendVerificationOTPControllerBuilder {
  static buildEnroll(): SendVerificationOTPController {
    return new SendVerificationOTPController(
      SendVerificationOTPInteractorBuilder.buildEnroll(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }

  static buildRecover(): SendVerificationOTPController {
    return new SendVerificationOTPController(
      SendVerificationOTPInteractorBuilder.buildRecover(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }

  static buildAuth(): SendVerificationOTPController {
    return new SendVerificationOTPController(
      SendVerificationOTPInteractorBuilder.buildAuth(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
