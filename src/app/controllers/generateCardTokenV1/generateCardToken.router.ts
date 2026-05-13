import type { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';

import type { IGenerateCardTokenController } from './generateCardToken.controller';
import { GenerateCardTokenControllerBuilder } from './generateCardToken.controller';

export class GenerateCardTokenV1Router {
  private readonly version: string = '/v1';
  private readonly generateCardTokenController: IGenerateCardTokenController;

  constructor(private readonly fastify: FastifyInstance) {
    this.generateCardTokenController = GenerateCardTokenControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/pos/tokens/generate`,
      handler: this.generateCardTokenController.handle.bind(this.generateCardTokenController),
    });
  }
}
