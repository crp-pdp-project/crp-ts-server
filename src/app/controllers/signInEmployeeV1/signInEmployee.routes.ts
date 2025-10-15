import { FastifyInstance } from 'fastify';

import { HttpMethod } from 'src/general/enums/methods.enum';

import { ISignInEmployeeController, SignInEmployeeControllerBuilder } from './signInEmployee.controller';

export class SignInEmployeeV1Router {
  private readonly version: string = '/v1';
  private readonly signInEmployeeController: ISignInEmployeeController;

  constructor(private readonly fastify: FastifyInstance) {
    this.signInEmployeeController = SignInEmployeeControllerBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/employees/sign-in`,
      handler: this.signInEmployeeController.handle.bind(this.signInEmployeeController),
    });
  }
}
