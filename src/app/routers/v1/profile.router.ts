import { FastifyInstance } from 'fastify';

import { DeleteBiometricPasswordBuilder } from 'src/app/controllers/deleteBiometricPassword/deleteBiometricPassword.builder';
import { DeleteBiometricPasswordController } from 'src/app/controllers/deleteBiometricPassword/deleteBiometricPassword.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { DeletePatientAccountBuilder } from '../../controllers/deletePatientAccount/deletePatientAccount.builder';
import { IDeletePatientAccountController } from '../../controllers/deletePatientAccount/deletePatientAccount.controller';
import { PatientProfileBuilder } from '../../controllers/patientProfile/patientProfile.builder';
import { IPatientProfileController } from '../../controllers/patientProfile/patientProfile.controller';
import { UpdateBiometricPasswordBuilder } from '../../controllers/updateBiometricPassword/updateBiometricPassword.builder';
import { IUpdateBiometricPasswordController } from '../../controllers/updateBiometricPassword/updateBiometricPassword.controller';
import { BaseRouter } from '../base.router';

export class ProfileV1Router extends BaseRouter {
  private readonly patientProfileController: IPatientProfileController;
  private readonly deletePatientAccountController: IDeletePatientAccountController;
  private readonly updateBiometricPassword: IUpdateBiometricPasswordController;
  private readonly deleteBiometricPassword: DeleteBiometricPasswordController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.patientProfileController = PatientProfileBuilder.build();
    this.deletePatientAccountController = DeletePatientAccountBuilder.build();
    this.updateBiometricPassword = UpdateBiometricPasswordBuilder.build();
    this.deleteBiometricPassword = DeleteBiometricPasswordBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.GET,
      url: `${this.versionV1}/patients/profile`,
      preHandler: this.validatePatientSession(),
      handler: this.patientProfileController.handle.bind(this.patientProfileController),
    });
    this.fastify.route({
      method: HttpMethod.DELETE,
      url: `${this.versionV1}/patients/account`,
      preHandler: this.validatePatientSession(),
      handler: this.deletePatientAccountController.handle.bind(this.deletePatientAccountController),
    });
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.versionV1}/patients/biometric-password`,
      preHandler: this.validatePatientSession(),
      handler: this.updateBiometricPassword.handle.bind(this.updateBiometricPassword),
    });
    this.fastify.route({
      method: HttpMethod.DELETE,
      url: `${this.versionV1}/patients/biometric-password`,
      preHandler: this.validatePatientSession(),
      handler: this.deleteBiometricPassword.handle.bind(this.deleteBiometricPassword),
    });
  }
}
