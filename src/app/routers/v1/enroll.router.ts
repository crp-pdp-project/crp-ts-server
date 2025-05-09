import { FastifyInstance } from 'fastify';

import { CreateEnrolledAccountBuilder } from 'src/app/controllers/createEnrolledAccount/createEnrolledAccount.builder';
import { ICreateEnrolledAccountController } from 'src/app/controllers/createEnrolledAccount/createEnrolledAccount.controller';
import { EnrollPatientBuilder } from 'src/app/controllers/enrollPatient/enrollPatient.builder';
import { IEnrollPatientController } from 'src/app/controllers/enrollPatient/enrollPatient.controller';
import { SendEnrollOTPBuilder } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.builder';
import { ISendEnrollOTPController } from 'src/app/controllers/sendEnrollOtp/sendEnrollOtp.controller';
import { ValidateEnrollOTPBuilder } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.builder';
import { IValidateEnrollOTPController } from 'src/app/controllers/validateEnrollOtp/validateEnrollOtp.controller';
import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

export class EnrollV1Router {
  private readonly version: string = '/v1';
  private readonly enrollPatientController: IEnrollPatientController;
  private readonly sendEnrollOTPController: ISendEnrollOTPController;
  private readonly validateEnrollOTPController: IValidateEnrollOTPController;
  private readonly validateSessionController: IValidateSessionController;
  private readonly createEnrolledAccountController: ICreateEnrolledAccountController;

  constructor(private readonly fastify: FastifyInstance) {
    this.enrollPatientController = EnrollPatientBuilder.build();
    this.sendEnrollOTPController = SendEnrollOTPBuilder.build();
    this.validateEnrollOTPController = ValidateEnrollOTPBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildEnroll();
    this.createEnrolledAccountController = CreateEnrolledAccountBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll`,
      handler: this.enrollPatientController.handle.bind(this.enrollPatientController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll/send`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.sendEnrollOTPController.handle.bind(this.sendEnrollOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll/validate`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.validateEnrollOTPController.handle.bind(this.validateEnrollOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/enroll/create`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.createEnrolledAccountController.handle.bind(this.createEnrolledAccountController),
    });
  }
}
