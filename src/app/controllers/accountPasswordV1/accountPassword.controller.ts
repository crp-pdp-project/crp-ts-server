import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  AccountPasswordInteractorBuilder,
  IAccountPasswordInteractor,
} from 'src/app/interactors/accountPassword/accountPassword.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

import { CreatePasswordControllerStrategy } from './strategies/createPassword.strategy';
import { UpdatePasswordControllerStrategy } from './strategies/updatePassword.strategy';

export interface IAccountPasswordControllerStrategy {
  execute(input: FastifyRequest, interactor: IAccountPasswordInteractor): Promise<void>;
}

export interface IAccountPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AccountPasswordController implements IAccountPasswordController {
  private response?: ResponseModel;

  constructor(
    private readonly accountPasswordInteractor: IAccountPasswordInteractor,
    private readonly accountPasswordStrategy: IAccountPasswordControllerStrategy,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this.accountPasswordStrategy.execute(input, this.accountPasswordInteractor);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class AccountPasswordControllerBuilder {
  static buildCreate(): AccountPasswordController {
    return new AccountPasswordController(
      AccountPasswordInteractorBuilder.buildCreate(),
      new CreatePasswordControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
  static buildUpdate(): AccountPasswordController {
    return new AccountPasswordController(
      AccountPasswordInteractorBuilder.buildUpdate(),
      new UpdatePasswordControllerStrategy(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
