import { FastifyInstance } from 'fastify';

import { SignInPatientBuilder } from 'src/app/controllers/signInPatient/signInPatient.builder';
import { ISignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignOutPatientBuilder } from 'src/app/controllers/signOutPatient/signOutPatient.builder';
import { ISignOutPatientController } from 'src/app/controllers/signOutPatient/signOutPatient.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { BaseRouter } from '../base.router';

export class AuthenticationV1Router extends BaseRouter {
  private readonly signInPatientRegularController: ISignInPatientController;
  private readonly signInPatientBiometricController: ISignInPatientController;
  private readonly signOutPatientController: ISignOutPatientController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.signInPatientRegularController = SignInPatientBuilder.buildRegular();
    this.signInPatientBiometricController = SignInPatientBuilder.buildBiometric();
    this.signOutPatientController = SignOutPatientBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/sign-in`,
      handler: this.signInPatientRegularController.handle.bind(this.signInPatientRegularController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/sign-in/biometric`,
      handler: this.signInPatientBiometricController.handle.bind(this.signInPatientBiometricController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/sign-out`,
      preHandler: this.validatePatientSession(),
      handler: this.signOutPatientController.handle.bind(this.signOutPatientController),
    });
  }
}
