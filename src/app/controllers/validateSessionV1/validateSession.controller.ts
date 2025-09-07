import { FastifyReply, FastifyRequest } from 'fastify';

import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import {
  IValidateSessionInteractor,
  ValidateSessionInteractorBuilder,
} from 'src/app/interactors/validateSession/validateSession.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IValidateSessionController {
  validate(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class ValidateSessionController implements IValidateSessionController {
  constructor(
    private readonly validateInteractor: IValidateSessionInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async validate(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const device = DeviceModel.extractDevice(input.device);
      const session = await this.validateInteractor.execute(input.headers, device);
      input.session = session;
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      const errorResponse = this.responseManager.validateResponse(errorModel);
      reply.code(errorResponse.statusCode).send(errorResponse.body);
    }
  }
}

export class ValidateSessionControllerBuilder {
  static buildSignIn(): ValidateSessionController {
    return new ValidateSessionController(
      ValidateSessionInteractorBuilder.buildSignIn(),
      ResponseManagerBuilder.buildError(),
    );
  }

  static buildEnroll(): ValidateSessionController {
    return new ValidateSessionController(
      ValidateSessionInteractorBuilder.buildEnroll(),
      ResponseManagerBuilder.buildError(),
    );
  }

  static buildRecover(): ValidateSessionController {
    return new ValidateSessionController(
      ValidateSessionInteractorBuilder.buildRecover(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
