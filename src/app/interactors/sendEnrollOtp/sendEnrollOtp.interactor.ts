import ejs from 'ejs';
import { FastifyRequest } from 'fastify';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IUpdateSessionOTPRepository } from 'src/app/repositories/database/updateSessionOTP.repository';
import { EmailClient } from 'src/clients/email.client';
import { InfobipClient } from 'src/clients/infobip.client';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { TextHelper } from 'src/general/helpers/text.helper';
import emailTemplate from 'src/general/templates/enrollEmail.template';
import smsTemplate from 'src/general/templates/enrollSMS.template';

export interface ISendEnrollOTPInteractor {
  send(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class SendEnrollOTPInteractor implements ISendEnrollOTPInteractor {
  private readonly infobipClient: InfobipClient = InfobipClient.instance;
  private readonly emailClient: EmailClient = EmailClient.instance;

  constructor(private readonly updateSessionOtp: IUpdateSessionOTPRepository) {}

  async send(input: FastifyRequest): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const otp = await this.sendOtp(session);
      await this.addOtpToSession(session.jti!, session.patient!.id!, otp);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): SessionModel {
    if (!session || !!session.otp) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session;
  }

  private async sendOtp(session: SessionModel): Promise<string> {
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

  private async addOtpToSession(jti: string, patientId: number, otp: string): Promise<void> {
    await this.updateSessionOtp.execute(jti, patientId, otp);
  }
}
