import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';

import { OperateX12ControllerBuilder, IOperateX12Controller } from './operateX12.controller';

export class OperateX12V1Router {
  private readonly version: string = '/v1';
  private readonly operateX12Controller: IOperateX12Controller;

  constructor(private readonly fastify: FastifyInstance) {
    this.operateX12Controller = OperateX12ControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/x12/:operation/:format`,
      handler: this.operateX12Controller.handle.bind(this.operateX12Controller),
    });
  }
}
