import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  ISendVerificationOTPInteractor,
  SendVerificationOTPInteractorBuilder,
} from 'src/app/interactors/sendVerificationOtp/sendVerificationOtp.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

import { SendEnrollOTPControllerStrategy } from './strategies/sendEnrollOtp.strategy';
import { SendRecoverOTPControllerStrategy } from './strategies/sendRecoverOtp.strategy';

export interface ISendVerificationOTPControllerStrategy {
  execute(input: FastifyRequest, interactor: ISendVerificationOTPInteractor): Promise<void>;
}

export interface ISendVerificationOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SendVerificationOTPController implements ISendVerificationOTPController {
  private response?: ResponseModel;

  constructor(
    private readonly sendOTPInteractor: ISendVerificationOTPInteractor,
    private readonly sendOTPStrategy: ISendVerificationOTPControllerStrategy,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this.sendOTPStrategy.execute(input, this.sendOTPInteractor);
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
      new SendEnrollOTPControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
  static buildRecover(): SendVerificationOTPController {
    return new SendVerificationOTPController(
      SendVerificationOTPInteractorBuilder.buildRecover(),
      new SendRecoverOTPControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
