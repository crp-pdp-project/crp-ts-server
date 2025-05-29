import { FastifyInstance } from 'fastify';

import { CreateEnrolledAccountBuilder } from 'src/app/controllers/createEnrolledAccount/createEnrolledAccount.builder';
import { ICreateEnrolledAccountController } from 'src/app/controllers/createEnrolledAccount/createEnrolledAccount.controller';
import { EnrollPatientBuilder } from 'src/app/controllers/enrollPatient/enrollPatient.builder';
import { IEnrollPatientController } from 'src/app/controllers/enrollPatient/enrollPatient.controller';
import { SendEnrollOTPBuilder } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.builder';
import { ISendEnrollOTPController } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.controller';
import { ValidateEnrollOTPBuilder } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.builder';
import { IValidateEnrollOTPController } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { BaseRouter } from '../base.router';

export class EnrollV1Router extends BaseRouter {
  private readonly enrollPatientController: IEnrollPatientController;
  private readonly sendEnrollOTPController: ISendEnrollOTPController;
  private readonly validateEnrollOTPController: IValidateEnrollOTPController;
  private readonly createEnrolledAccountController: ICreateEnrolledAccountController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.enrollPatientController = EnrollPatientBuilder.build();
    this.sendEnrollOTPController = SendEnrollOTPBuilder.build();
    this.validateEnrollOTPController = ValidateEnrollOTPBuilder.build();
    this.createEnrolledAccountController = CreateEnrolledAccountBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/enroll`,
      handler: this.enrollPatientController.handle.bind(this.enrollPatientController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/enroll/otp/send`,
      preHandler: this.validateEnrollSession(),
      handler: this.sendEnrollOTPController.handle.bind(this.sendEnrollOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/enroll/otp/validate`,
      preHandler: this.validateEnrollSession(),
      handler: this.validateEnrollOTPController.handle.bind(this.validateEnrollOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/account`,
      preHandler: this.validateEnrollSession(),
      handler: this.createEnrolledAccountController.handle.bind(this.createEnrolledAccountController),
    });
  }
}
