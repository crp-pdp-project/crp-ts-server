import { FastifyInstance } from 'fastify';

import { RecoverPasswordBuilder } from 'src/app/controllers/recoverPassword/recoverPassword.builder';
import { IRecoverPasswordController } from 'src/app/controllers/recoverPassword/recoverPassword.controller';
import { SendRecoverOTPBuilder } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.builder';
import { ISendRecoverOTPController } from 'src/app/controllers/sendRecoverOtp/sendRecoverOtp.controller';
import { UpdatePatientPasswordBuilder } from 'src/app/controllers/updatePatientPassword/updatePatientPassword.builder';
import { IUpdatePatientPasswordController } from 'src/app/controllers/updatePatientPassword/updatePatientPassword.controller';
import { ValidateRecoverOTPBuilder } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.builder';
import { IValidateRecoverOTPController } from 'src/app/controllers/validateRecoverOtp/validateRecoverOtp.controller';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { BaseRouter } from '../base.router';

export class RecoverV1Router extends BaseRouter {
  private readonly recoverPasswordController: IRecoverPasswordController;
  private readonly sendRecoverOTPController: ISendRecoverOTPController;
  private readonly validateRecoverOTPController: IValidateRecoverOTPController;
  private readonly updatePatientPasswordController: IUpdatePatientPasswordController;

  constructor(private readonly fastify: FastifyInstance) {
    super();

    this.recoverPasswordController = RecoverPasswordBuilder.build();
    this.sendRecoverOTPController = SendRecoverOTPBuilder.build();
    this.validateRecoverOTPController = ValidateRecoverOTPBuilder.build();
    this.updatePatientPasswordController = UpdatePatientPasswordBuilder.build();
  }

  registerRouter(): void {
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/recover-password`,
      handler: this.recoverPasswordController.handle.bind(this.recoverPasswordController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/recover-password/otp/send`,
      preHandler: this.validateRecoverSession(),
      handler: this.sendRecoverOTPController.handle.bind(this.sendRecoverOTPController),
    });
    this.fastify.route({
      method: HttpMethod.POST,
      url: `${this.versionV1}/patients/recover-password/otp/validate`,
      preHandler: this.validateRecoverSession(),
      handler: this.validateRecoverOTPController.handle.bind(this.validateRecoverOTPController),
    });
    this.fastify.route({
      method: HttpMethod.PATCH,
      url: `${this.versionV1}/patients/password`,
      preHandler: this.validateRecoverSession(),
      handler: this.updatePatientPasswordController.handle.bind(this.updatePatientPasswordController),
    });
  }
}
