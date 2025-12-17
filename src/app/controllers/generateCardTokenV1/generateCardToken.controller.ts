import { FastifyReply, FastifyRequest } from 'fastify';

import {
  GenerateCardTokenBodyDTOSchema,
  GenerateCardTokenInputDTO,
  GenerateCardTokenQueryDTOSchema,
} from 'src/app/entities/dtos/input/generateCardToken.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  GenerateCardTokenInteractorBuilder,
  IGenerateCardTokenInteractor,
} from 'src/app/interactors/generateCardToken/generateCardToken.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IGenerateCardTokenController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class GenerateCardTokenController implements IGenerateCardTokenController {
  private response?: ResponseModel;

  constructor(
    private readonly generateCardToken: IGenerateCardTokenInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<GenerateCardTokenInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const query = GenerateCardTokenQueryDTOSchema.parse(input.query);
      const body = GenerateCardTokenBodyDTOSchema.safeParse(input.body);
      const model = await this.generateCardToken.generate(body, query);
      reply.redirect(model.redirectUrl, model.redirectStatus);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
      reply.code(this.response.statusCode).send(this.response.body);
    }
  }
}

export class GenerateCardTokenControllerBuilder {
  static build(): GenerateCardTokenController {
    return new GenerateCardTokenController(
      GenerateCardTokenInteractorBuilder.build(),
      ResponseManagerBuilder.buildError(),
    );
  }
}
