import { FastifyReply, FastifyRequest } from 'fastify';

import { RelationshipsListOutputDTOSchema } from 'src/app/entities/dtos/output/relationshipsList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  RelationshipsListInteractorBuilder,
  IRelationshipsListInteractor,
} from 'src/app/interactors/relationshipsList/relationshipsList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IRelationshipsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class RelationshipsListController implements IRelationshipsListController {
  private response?: ResponseModel;

  constructor(
    private readonly relationshipsInteractor: IRelationshipsListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.relationshipsInteractor.list();
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class RelationshipsListControllerBuilder {
  static build(): RelationshipsListController {
    return new RelationshipsListController(
      RelationshipsListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(RelationshipsListOutputDTOSchema),
    );
  }
}
