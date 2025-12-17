import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

import { CreatePasswordControllerStrategyBuilder } from './strategies/createPassword.strategy';
import { UpdatePasswordControllerStrategyBuilder } from './strategies/updatePassword.strategy';

export interface IAccountPasswordControllerStrategy {
  execute(input: FastifyRequest): Promise<void>;
}

export interface IAccountPasswordController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AccountPasswordController implements IAccountPasswordController {
  private response?: ResponseModel;

  constructor(
    private readonly accountPasswordStrategy: IAccountPasswordControllerStrategy,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this.accountPasswordStrategy.execute(input);
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
      CreatePasswordControllerStrategyBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
  static buildUpdate(): AccountPasswordController {
    return new AccountPasswordController(
      UpdatePasswordControllerStrategyBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
