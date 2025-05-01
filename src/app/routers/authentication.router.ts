import { FastifyInstance } from 'fastify';

import { SignInPatientBuilder } from 'src/app/controllers/signInPatient/signInPatient.builder';
import { ISignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignOutPatientBuilder } from 'src/app/controllers/signOutPatient/signOutPatient.builder';
import { ISignOutPatientController } from 'src/app/controllers/signOutPatient/signOutPatient.controller';
import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';

export class AuthenticationRouter {
  private readonly signInPatientController: ISignInPatientController;
  private readonly signOutPatientController: ISignOutPatientController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.signInPatientController = SignInPatientBuilder.build();
    this.signOutPatientController = SignOutPatientBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildSession();
  }

  registerRouter(): void {
    this.fastify.route({
      method: 'POST',
      url: '/patients/sign-in',
      handler: this.signInPatientController.handle.bind(this.signInPatientController),
    });
    this.fastify.route({
      method: 'POST',
      url: '/patients/sign-out',
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.signOutPatientController.handle.bind(this.signOutPatientController),
    });
  }
}
