import { FastifyInstance } from 'fastify';

import { RecoverPasswordBuilder } from 'src/app/controllers/recoverPassword/recoverPassword.builder';
import { IRecoverPasswordController } from 'src/app/controllers/recoverPassword/recoverPassword.controller';
import { SendRecoverOTPBuilder } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.builder';
import { UpdatePatientPasswordBuilder } from 'src/app/controllers/updatePatientPassword/updatePatientPassword.builder';
import { IUpdatePatientPasswordController } from 'src/app/controllers/updatePatientPassword/updatePatientPassword.controller';
import { ValidateRecoverOTPBuilder } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.builder';
import { IValidateRecoverOTPController } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.controller';
import { ValidateSessionBuilder } from 'src/app/controllers/validateSession/validateSession.builder';
import { IValidateSessionController } from 'src/app/controllers/validateSession/validateSession.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

export class RecoverV1Router {
  private readonly version: string = '/v1';
  private readonly recoverPasswordController: IRecoverPasswordController;
  private readonly sendRecoverOTPController: IRecoverPasswordController;
  private readonly validateRecoverOTPController: IValidateRecoverOTPController;
  private readonly validateSessionController: IValidateSessionController;
  private readonly updatePatientPasswordController: IUpdatePatientPasswordController;

  constructor(private readonly fastify: FastifyInstance) {
    this.recoverPasswordController = RecoverPasswordBuilder.build();
    this.sendRecoverOTPController = SendRecoverOTPBuilder.build();
    this.validateRecoverOTPController = ValidateRecoverOTPBuilder.build();
    this.validateSessionController = ValidateSessionBuilder.buildRecover();
    this.updatePatientPasswordController = UpdatePatientPasswordBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover`,
      handler: this.recoverPasswordController.handle.bind(this.recoverPasswordController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover/send`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.sendRecoverOTPController.handle.bind(this.sendRecoverOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.version}/patients/recover/validate`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.validateRecoverOTPController.handle.bind(this.validateRecoverOTPController),
    });
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.version}/patients/recover/update`,
      preHandler: this.validateSessionController.validate.bind(this.validateSessionController),
      handler: this.updatePatientPasswordController.handle.bind(this.updatePatientPasswordController),
    });
  }
}
