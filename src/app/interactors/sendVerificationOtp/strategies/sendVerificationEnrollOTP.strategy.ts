import ejs from 'ejs';

import { SessionModel } from 'src/app/entities/models/session.model';
import { EmailClient } from 'src/clients/email.client';
import { InfobipClient } from 'src/clients/infobip.client';
import { TextHelper } from 'src/general/helpers/text.helper';
import emailTemplate from 'src/general/templates/enrollEmail.template';
import smsTemplate from 'src/general/templates/enrollSMS.template';

import { ISendVerificationOTPStrategy } from '../sendVerificationOtp.interactor';

export class SendVerificationEnrollOTPStrategy implements ISendVerificationOTPStrategy {
  private readonly infobipClient: InfobipClient = InfobipClient.instance;
  private readonly emailClient: EmailClient = EmailClient.instance;

  async sendOtp(session: SessionModel): Promise<string> {
    const otp = TextHelper.generateOtp();
    await this.sendEmailOtp(session, otp);
    await this.sendSmsOtp(session, otp);

    return otp;
  }

  private async sendEmailOtp(session: SessionModel, otp: string): Promise<void> {
    if (session.payload?.email) {
      await this.emailClient.send({
        to: session.payload.email,
        subject: process.env.EMAIL_ENROLL_SUBJECT ?? '',
        html: ejs.render(emailTemplate, {
          name: session.patient?.firstName,
          otp,
        }),
      });
    }
  }

  private async sendSmsOtp(session: SessionModel, otp: string): Promise<void> {
    if (session.payload?.phone) {
      await this.infobipClient.sendSms({
        from: process.env.INFOBIP_SENDER ?? '',
        to: session.payload.phone,
        text: ejs.render(smsTemplate, {
          name: session.patient?.firstName,
          otp,
        }),
      });
    }
  }
}
