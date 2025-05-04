import nodemailer, { Transporter } from 'nodemailer';

import { LoggerClient } from 'src/clients/logger.client';

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

type MailResponse = {
  messageId: string;
};

export class EmailClient {
  static readonly instance = new EmailClient();
  private readonly logger = LoggerClient.instance;
  private readonly transporter: Transporter<MailResponse>;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(options: EmailOptions): Promise<void> {
    const result = await this.transporter.sendMail({
      from: options.from ?? `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
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
