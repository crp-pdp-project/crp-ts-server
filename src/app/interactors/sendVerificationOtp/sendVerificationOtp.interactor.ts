import ejs from 'ejs';

import type { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import type { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IUpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { UpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { EmailClient } from 'src/clients/email/email.client';
import { InfobipClient } from 'src/clients/infobip/infobip.client';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { InfobipConstants } from 'src/general/contants/infobip.constants';
import type { EmailSubjects } from 'src/general/enums/emailSubject.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { TextHelper } from 'src/general/helpers/text.helper';
import otpEmailTemplate from 'src/general/templates/otpEmail.template';
import otpSmsTemplate from 'src/general/templates/otpSMS.template';

import { SendAuthOTPStrategyBuilder } from './strategies/sendAuthOtp.strategy';
import { SendEnrollOTPStrategyBuilder } from './strategies/sendEnrollOtp.strategy';
import { SendRecoverOTPStrategyBuilder } from './strategies/sendRecoverOtp.strategy';

export interface ISendVerificationOTPStrategy {
  validate(session: SessionModel): Promise<PatientExternalModel>;
  getSubject(): EmailSubjects;
}

export interface ISendVerificationOTPInteractor {
  sendOTP(session: SessionModel): Promise<void>;
}

export class SendVerificationOTPInteractor implements ISendVerificationOTPInteractor {
  private readonly infobipClient: InfobipClient = InfobipClient.instance;
  private readonly emailClient: EmailClient = EmailClient.instance;
  private readonly dryRun: boolean = !!EnvHelper.getOptional('DRY_RUN_OTP');
  private readonly logger: LoggerClient = LoggerClient.instance;

  constructor(
    private readonly sendOTPStrategy: ISendVerificationOTPStrategy,
    private readonly updateSessionOtp: IUpdateSessionOTPRepository,
  ) {}

  async sendOTP(session: SessionModel): Promise<void> {
    const patient = await this.sendOTPStrategy.validate(session);
    const otp = TextHelper.generateUniqueCode();
    await this.send(patient, otp);
    await this.addOtpToSession(session, patient, otp);
  }

  private isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
    return result.status === 'fulfilled';
  }

  private isRejected<T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult {
    return result.status === 'rejected';
  }

  private async send(patient: PatientExternalModel, otp: SessionDM['otp']): Promise<void> {
    if (!this.dryRun) {
      await this.executeSend(patient, otp);
    } else {
      this.logger.info('dry run otp', { otp });
    }
  }

  private async executeSend(patient: PatientExternalModel, otp: SessionDM['otp']): Promise<void> {
    const promiseResult = await Promise.allSettled([this.sendEmail(patient, otp), this.sendSms(patient, otp)]);

    const fulfilledCount = promiseResult.filter((result) => this.isFulfilled(result)).length;
    const errorArray = promiseResult.filter((result) => this.isRejected(result));

    errorArray.forEach((error) => {
      this.logger.error('Send OTP handled error', { error: error.reason });
    });

    if (fulfilledCount === 0) {
      throw ErrorModel.badRequest({ message: 'No OTP was sent to any channel' });
    }
  }

  private async sendEmail(patient: PatientExternalModel, otp: SessionDM['otp']): Promise<void> {
    if (patient.email) {
      await this.emailClient.send({
        to: patient.email,
        subject: this.sendOTPStrategy.getSubject(),
        html: ejs.render(otpEmailTemplate, {
          name: patient.firstName ?? '',
          otp,
        }),
      });
    }
  }

  private async sendSms(patient: PatientExternalModel, otp: SessionDM['otp']): Promise<void> {
    if (patient.phone) {
      await this.infobipClient.sendSms({
        from: InfobipConstants.INFOBIP_SENDER,
        to: TextHelper.addCityCode(patient.phone)!,
        text: ejs.render(otpSmsTemplate, {
          name: patient.firstName ?? '',
          otp,
        }),
      });
    }
  }

  private async addOtpToSession(
    session: SessionModel,
    patient: PatientExternalModel,
    otp: SessionDM['otp'],
  ): Promise<void> {
    const newSendCount = (session.otpSendCount ?? 0) + 1;

    await this.updateSessionOtp.execute(session.jti, patient.id!, otp, newSendCount);
  }
}

export class SendVerificationOTPInteractorBuilder {
  static buildEnroll(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(SendEnrollOTPStrategyBuilder.build(), new UpdateSessionOTPRepository());
  }
  static buildRecover(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(SendRecoverOTPStrategyBuilder.build(), new UpdateSessionOTPRepository());
  }
  static buildAuth(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(SendAuthOTPStrategyBuilder.build(), new UpdateSessionOTPRepository());
  }
}
