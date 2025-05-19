import ejs from 'ejs';

import { RecoverSessionModel } from 'src/app/entities/models/recoverSession.model';
import { EmailClient } from 'src/clients/email.client';
import { InfobipClient } from 'src/clients/infobip.client';
import { TextHelper } from 'src/general/helpers/text.helper';
import emailTemplate from 'src/general/templates/recoverEmail.template';
import smsTemplate from 'src/general/templates/recoverSMS.template';

import { ISendVerificationOTPStrategy } from '../sendVerificationOtp.interactor';

export class SendVerificationRecoverOTPStrategy implements ISendVerificationOTPStrategy {
  private readonly infobipClient: InfobipClient = InfobipClient.instance;
  private readonly emailClient: EmailClient = EmailClient.instance;

  async sendOTP(session: RecoverSessionModel): Promise<string> {
    const otp = TextHelper.generateOtp();
    await this.sendEmailOtp(session, otp);
    await this.sendSmsOtp(session, otp);

    return otp;
  }

  private async sendEmailOtp(session: RecoverSessionModel, otp: string): Promise<void> {
    if (session.external.email) {
      await this.emailClient.send({
        to: session.external.email,
        subject: process.env.EMAIL_ENROLL_SUBJECT ?? '',
        html: ejs.render(emailTemplate, {
          name: session.patient.firstName,
          otp,
        }),
      });
    }
  }

  private async sendSmsOtp(session: RecoverSessionModel, otp: string): Promise<void> {
    if (session.external.phone) {
      await this.infobipClient.sendSms({
        from: process.env.INFOBIP_SENDER ?? '',
        to: session.external.phone,
        text: ejs.render(smsTemplate, {
          name: session.patient.firstName,
          otp,
        }),
      });
    }
  }
}
