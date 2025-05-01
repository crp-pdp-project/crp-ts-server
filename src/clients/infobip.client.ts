import { LoggerClient } from 'src/clients/logger.client';
import { RestClient } from 'src/clients/rest.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type SmsMessage = {
  from: string;
  to: string;
  text: string;
};

type InfobipSmsResponse = {
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
  private readonly request: RestClient = RestClient.instance;
  private readonly baseUrl: string = process.env.INFOBIP_BASE_URL ?? '';
  private readonly apiKey: string = process.env.INFOBIP_API_KEY ?? '';

  async sendSms(message: SmsMessage): Promise<InfobipSmsResponse> {
    const url = `${this.baseUrl}/sms/3/messages`;

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

    const responseData = await this.request.send<InfobipSmsResponse>({
      method: HttpMethod.POST,
      headers: { Authorization: `App ${this.apiKey}` },
      url,
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
