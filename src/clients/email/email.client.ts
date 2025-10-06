import nodemailer, { Transporter } from 'nodemailer';

import { LoggerClient } from 'src/clients/logger/logger.client';
import { EmailConstants } from 'src/general/contants/email.constants';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';

export type EmailOptions = {
  to: string;
  subject: EmailSubjects;
  html: string;
  from?: string;
};

export type MailResponse = {
  messageId: string;
};

export class EmailClient {
  static readonly instance = new EmailClient();
  private readonly logger = LoggerClient.instance;
  private readonly transporter: Transporter<MailResponse>;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: EnvHelper.get('SMTP_HOST'),
      port: Number(EnvHelper.get('SMTP_PORT')),
      secure: true,
      requireTLS: true,
      auth: {
        user: EnvHelper.get('SMTP_USER'),
        pass: EnvHelper.get('SMTP_PASS'),
      },
    });
  }

  async send(options: EmailOptions): Promise<void> {
    const result = await this.transporter.sendMail({
      from: options.from ?? `"${EmailConstants.FROM_NAME}" <${EmailConstants.FROM_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    this.logger.info('Email Sent Successfully', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId,
    });
  }
}
