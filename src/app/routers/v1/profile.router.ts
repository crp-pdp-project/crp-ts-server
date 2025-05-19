import { FastifyInstance } from 'fastify';

import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { DeletePatientAccountBuilder } from '../../controllers/deletePatientAccount/deletePatientAccount.builder';
import { IDeletePatientAccountController } from '../../controllers/deletePatientAccount/deletePatientAccount.controller';
import { PatientProfileBuilder } from '../../controllers/patientProfile/patientProfile.builder';
import { IPatientProfileController } from '../../controllers/patientProfile/patientProfile.controller';
import { UpdateBiometricPasswordBuilder } from '../../controllers/updateBiometricPassword/updateBiometricPassword.builder';
import { IUpdateBiometricPasswordController } from '../../controllers/updateBiometricPassword/updateBiometricPassword.controller';

export class ProfileV1Router {
  private readonly version: string = '/v1';
  private readonly patientProfileController: IPatientProfileController;
  private readonly deletePatientAccountController: IDeletePatientAccountController;
  private readonly updateBiometricPassword: IUpdateBiometricPasswordController;
  private readonly validateSessionController: IValidateSessionController;

  constructor(private readonly fastify: FastifyInstance) {
    this.patientProfileController = PatientProfileBuilder.build();
    this.deletePatientAccountController = DeletePatientAccountBuilder.build();
    this.updateBiometricPassword = UpdateBiometricPasswordBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildPatient();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.version}/patients/profile`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.patientProfileController.handle.bind(this.patientProfileController),
    });
    this.fastify.route({
      method: HttpMethod.DELETE,
      url: `${this.version}/patients/account`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.deletePatientAccountController.handle.bind(this.deletePatientAccountController),
    });
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patients/biometric-password`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.updateBiometricPassword.handle.bind(this.updateBiometricPassword),
    });
  }
}
