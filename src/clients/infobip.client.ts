import { LoggerClient } from 'src/clients/logger.client';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { RestHelper } from 'src/general/helpers/rest.helper';

export type SmsMessage = {
  from: string;
  to: string;
  text: string;
};

export type InfobipSmsResponse = {
  bulkId?: string;
  messages: {
    to: string;
    status: {
      groupId: number;
      groupName: string;
      id: number;
      name: string;
      description: string;
    };
    messageId: string;
  }[];
};

export class InfobipClient {
  static readonly instance: InfobipClient = new InfobipClient();
  private readonly logger: LoggerClient = LoggerClient.instance;
  private readonly host: string = EnvHelper.get('INFOBIP_HOST');
  private readonly apiKey: string = EnvHelper.get('INFOBIP_API_KEY');
  private readonly rest: RestHelper = new RestHelper(this.host);

  async sendSms(message: SmsMessage): Promise<InfobipSmsResponse> {
    const body = {
      messages: [
        {
          destinations: [{ to: message.to }],
          content: {
            text: message.text,
          },
        },
      ],
    };

    const responseData = await this.rest.send<InfobipSmsResponse>({
      method: HttpMethod.POST,
      headers: { Authorization: `App ${this.apiKey}` },
      path: '/sms/3/messages',
      body,
    });

    this.logger.info('SMS Sent Successfully', {
      to: message.to,
      from: message.from,
      messageId: responseData.messages?.[0]?.messageId,
    });

    return responseData;
  }
}
