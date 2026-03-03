import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';
import { RouterHelper } from 'src/general/helpers/router.helper';

import type { IValidateHeadersController } from '../validateHeadersV1/validateHeaders.controller';
import { ValidateHeadersControllerBuilder } from '../validateHeadersV1/validateHeaders.controller';
import type { IValidateSessionController } from '../validateSessionV1/validateSession.controller';
import { ValidateSessionControllerBuilder } from '../validateSessionV1/validateSession.controller';

import type { IRelationshipsListController } from './relationshipsList.controller';
import { RelationshipsListControllerBuilder } from './relationshipsList.controller';

export class RelationshipsListV1Router {
  private readonly version: string = '/v1';
  private readonly relationshipsListController: IRelationshipsListController;
  private readonly validateHeadersController: IValidateHeadersController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.relationshipsListController = RelationshipsListControllerBuilder.build();
    this.validateHeadersController = ValidateHeadersControllerBuilder.build();
    this.validateSessionController = ValidateSessionControllerBuilder.buildSignIn();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/relationships`,
      preHandler: RouterHelper.wrapPreHandlers(
        this.validateHeadersController.validate.bind(this.validateHeadersController),
        this.validateSessionController.validate.bind(this.validateSessionController),
      ),
      handler: this.relationshipsListController.handle.bind(this.relationshipsListController),
    });
  }
}
