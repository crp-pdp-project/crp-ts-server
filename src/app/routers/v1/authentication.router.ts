import { FastifyInstance } from 'fastify';

import { SignInPatientBuilder } from 'src/app/controllers/signInPatient/signInPatient.builder';
import { ISignInPatientController } from 'src/app/controllers/signInPatient/signInPatient.controller';
import { SignOutPatientBuilder } from 'src/app/controllers/signOutPatient/signOutPatient.builder';
import { ISignOutPatientController } from 'src/app/controllers/signOutPatient/signOutPatient.controller';
import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

export class AuthenticationV1Router {
  private readonly version: string = '/v1';
  private readonly signInPatientRegularController: ISignInPatientController;
  private readonly signInPatientBiometricController: ISignInPatientController;
  private readonly signOutPatientController: ISignOutPatientController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.signInPatientRegularController = SignInPatientBuilder.buildRegular();
    this.signInPatientBiometricController = SignInPatientBuilder.buildBiometric();
    this.signOutPatientController = SignOutPatientBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildPatient();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/sign-in`,
      handler: this.signInPatientRegularController.handle.bind(this.signInPatientRegularController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/sign-in/biometric`,
      handler: this.signInPatientBiometricController.handle.bind(this.signInPatientBiometricController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/sign-out`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.signOutPatientController.handle.bind(this.signOutPatientController),
    });
  }
}
