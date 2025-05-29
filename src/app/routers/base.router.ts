import { FastifyReply, FastifyRequest, HookHandlerDoneFunction, preHandlerHookHandler } from 'fastify';

import { ValidateSessionBuilder } from '../controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from '../controllers/validateSession/validateSession.controller';

export abstract class BaseRouter {
  protected readonly versionV1 = '/v1';

  private readonly validatePatientSessionController: IValidateSessionController;
  private readonly validateEnrollSessionController: IValidateSessionController;
  private readonly validateRecoverSessionController: IValidateSessionController;

  constructor() {
    this.validatePatientSessionController = ValidateSessionBuilder.buildPatient();
    this.validateEnrollSessionController = ValidateSessionBuilder.buildEnroll();
    this.validateRecoverSessionController = ValidateSessionBuilder.buildRecover();
  }

  protected validatePatientSession(): preHandlerHookHandler {
    return this.wrapController(this.validatePatientSessionController);
  }

  protected validateEnrollSession(): preHandlerHookHandler {
    return this.wrapController(this.validateEnrollSessionController);
  }

  protected validateRecoverSession(): preHandlerHookHandler {
    return this.wrapController(this.validateRecoverSessionController);
  }

  private wrapController(controller: IValidateSessionController): preHandlerHookHandler {
    return (input: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
      controller
        .validate(input, reply)
        .then(() => done())
        .catch(done);
    };
  }
}
