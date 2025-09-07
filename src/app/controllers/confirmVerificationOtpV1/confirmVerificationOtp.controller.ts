import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  ConfirmVerificationOTPInteractorBuilder,
  IConfirmVerificationOTPInteractor,
} from 'src/app/interactors/confirmVerificationOtp/confirmVerificationOtp.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

import { ConfirmEnrollOTPControllerStrategy } from './strategies/confirmEnrollOtp.strategy';
import { ConfirmRecoverOTPControllerStrategy } from './strategies/confirmRecoverOtp.strategy';

export interface IConfirmVerificationOTPControllerStrategy {
  execute(input: FastifyRequest, interactor: IConfirmVerificationOTPInteractor): Promise<void>;
}

export interface IConfirmVerificationOTPController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ConfirmVerificationOTPController implements IConfirmVerificationOTPController {
  private response?: ResponseModel;

  constructor(
    private readonly confirmVerificationOTP: IConfirmVerificationOTPInteractor,
    private readonly confirmVerificationStrategy: IConfirmVerificationOTPControllerStrategy,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this.confirmVerificationStrategy.execute(input, this.confirmVerificationOTP);
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
      new ConfirmEnrollOTPControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }

  static buildRecover(): ConfirmVerificationOTPController {
    return new ConfirmVerificationOTPController(
      ConfirmVerificationOTPInteractorBuilder.buildRecover(),
      new ConfirmRecoverOTPControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
