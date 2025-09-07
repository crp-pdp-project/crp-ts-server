import ejs from 'ejs';

import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { AuthAttemptModel } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import {
  GetAuthAttemptsRepository,
  IGetAuthAttemptsRepository,
} from 'src/app/repositories/database/getAuthAttempts.repository';
import {
  IUpdateSessionOTPRepository,
  UpdateSessionOTPRepository,
} from 'src/app/repositories/database/updateSessionOTP.repository';
import { EmailClient } from 'src/clients/email.client';
import { InfobipClient } from 'src/clients/infobip.client';
import { InfobipConstants } from 'src/general/contants/infobip.constants';
import { TextHelper } from 'src/general/helpers/text.helper';

import {
  IVerificationOtpConfig,
  VerificationOtpEnroll,
  VerificationOtpRecover,
} from './config/sendVerificationOtp.config';

type CombinedTransacSession = EnrollSessionModel | RecoverSessionModel;

export interface ISendVerificationOTPInteractor {
  sendOTP(session: CombinedTransacSession): Promise<void>;
}

export class SendVerificationOTPInteractor implements ISendVerificationOTPInteractor {
  private readonly infobipClient: InfobipClient = InfobipClient.instance;
  private readonly emailClient: EmailClient = EmailClient.instance;

  constructor(
    private readonly verificationOtpConfig: IVerificationOtpConfig,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly updateSessionOtp: IUpdateSessionOTPRepository,
  ) {}

  async sendOTP(session: CombinedTransacSession): Promise<void> {
    session.validateOtpLimit();
    const attemptModel = await this.fetchAttempt(session.patient.documentNumber);
    attemptModel.validateAttempt();
    const otp = TextHelper.generateOtp();
    await this.sendOtp(session, otp);
    await this.addOtpToSession(session, otp);
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.verificationOtpConfig.flowIdentifier);
    const attemptModel = new AuthAttemptModel(
      { ...attempt, documentNumber },
      this.verificationOtpConfig.flowIdentifier,
    );
    return attemptModel;
  }

  private async sendOtp(session: CombinedTransacSession, otp: SessionDM['otp']): Promise<void> {
    const promiseResult = await Promise.allSettled([this.sendEmail(session, otp), this.sendSms(session, otp)]);

    const fulfilledCount = promiseResult.filter(({ status }) => status === 'fulfilled').length;

    if (fulfilledCount === 0) {
      throw ErrorModel.badRequest({ message: 'No OTP was sent to any channel' });
    }
  }

  private async sendEmail(session: CombinedTransacSession, otp: SessionDM['otp']): Promise<void> {
    if (session.external.email) {
      await this.emailClient.send({
        to: session.external.email,
        subject: this.verificationOtpConfig.subject,
        html: ejs.render(this.verificationOtpConfig.emailTemplate, {
          name: session.patient.firstName,
          otp,
        }),
      });
    }
  }

  private async sendSms(session: CombinedTransacSession, otp: SessionDM['otp']): Promise<void> {
    if (session.external.phone) {
      await this.infobipClient.sendSms({
        from: InfobipConstants.INFOBIP_SENDER,
        to: session.external.phone,
        text: ejs.render(this.verificationOtpConfig.smsTemplate, {
          name: session.patient.firstName,
          otp,
        }),
      });
    }
  }

  private async addOtpToSession(session: CombinedTransacSession, otp: SessionDM['otp']): Promise<void> {
    const newSendCount = (session.otpSendCount ?? 0) + 1;

    await this.updateSessionOtp.execute(session.jti, session.patient.id, otp, newSendCount);
  }
}

export class SendVerificationOTPInteractorBuilder {
  static buildEnroll(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new VerificationOtpEnroll(),
      new GetAuthAttemptsRepository(),
      new UpdateSessionOTPRepository(),
    );
  }
  static buildRecover(): SendVerificationOTPInteractor {
    return new SendVerificationOTPInteractor(
      new VerificationOtpRecover(),
      new GetAuthAttemptsRepository(),
      new UpdateSessionOTPRepository(),
    );
  }
}
