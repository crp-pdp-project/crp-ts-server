import ejs from 'ejs';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import {
  IUpdateSessionOTPRepository,
  UpdateSessionOTPRepository,
} from 'src/app/repositories/database/updateSessionOTP.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { EmailClient } from 'src/clients/email/email.client';
import { InfobipClient } from 'src/clients/infobip/infobip.client';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { InfobipConstants } from 'src/general/contants/infobip.constants';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';
import { TextHelper } from 'src/general/helpers/text.helper';
import otpEmailTemplate from 'src/general/templates/otpEmail.template';
import otpSmsTemplate from 'src/general/templates/otpSMS.template';

import { SendAuthOTPStrategy } from './strategies/sendAuthOtp.strategy';
import { SendEnrollOTPStrategy } from './strategies/sendEnrollOtp.strategy';
import { SendRecoverOTPStrategy } from './strategies/sendRecoverOtp.strategy';

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

  constructor(
    private readonly sendOTPStrategy: ISendVerificationOTPStrategy,
    private readonly updateSessionOtp: IUpdateSessionOTPRepository,
  ) {}

  async sendOTP(session: SessionModel): Promise<void> {
    const patient = await this.sendOTPStrategy.validate(session);
    const otp = TextHelper.generateUniqueCode();
    await this.sendOtp(patient, otp);
    await this.addOtpToSession(session, patient, otp);
  }

  private isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
    return result.status === 'fulfilled';
  }

  private isRejected<T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult {
    return result.status === 'rejected';
  }

  private async sendOtp(patient: PatientExternalModel, otp: SessionDM['otp']): Promise<void> {
    const promiseResult = await Promise.allSettled([this.sendEmail(patient, otp), this.sendSms(patient, otp)]);

    const fulfilledCount = promiseResult.filter((result) => this.isFulfilled(result)).length;
    const errorArray = promiseResult.filter((result) => this.isRejected(result));

    errorArray.forEach((error) => {
      LoggerClient.instance.error('Send OTP handled error', { error: error.reason });
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
    return new SendVerificationOTPInteractor(
      new SendEnrollOTPStrategy(new GetAuthAttemptsRepository()),
      new UpdateSessionOTPRepository(),
    );
  }
  static buildRecover(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new SendRecoverOTPStrategy(new GetAuthAttemptsRepository()),
      new UpdateSessionOTPRepository(),
    );
  }
  static buildAuth(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new SendAuthOTPStrategy(new SearchPatientRepository()),
      new UpdateSessionOTPRepository(),
    );
  }
}
