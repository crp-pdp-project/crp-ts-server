import { SendNotificationBodyDTO } from 'src/app/entities/dtos/input/sendNotification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import {
  GetDeviceTokensRepository,
  IGetDeviceTokensRepository,
} from 'src/app/repositories/database/getDeviceTokens.repository';
import {
  ISendPushNotificationRepository,
  SendPushNotificationRepository,
} from 'src/app/repositories/rest/sendPushNotifications.repository';

export interface ISendNotificationInteractor {
  send(body: SendNotificationBodyDTO): Promise<void>;
}

export class SendNotificationInteractor implements ISendNotificationInteractor {
  constructor(
    private readonly getDeviceTokens: IGetDeviceTokensRepository,
    private readonly sendPushNotification: ISendPushNotificationRepository,
  ) {}

  async send(body: SendNotificationBodyDTO): Promise<void> {
    const tokens = await this.getTokenArray(body);
    await this.sendPushNotification.execute(body.device, {
      title: body.title,
      body: body.body,
      url: body.url,
      tokens,
    });
  }

  private async getTokenArray(body: SendNotificationBodyDTO): Promise<string[]> {
    const devices = await this.getDeviceTokens.execute(body.documentType, body.documentNumber);

    const tokens = devices.flatMap(({ pushToken }) => pushToken ?? []);

    if (tokens.length === 0) {
      throw ErrorModel.unprocessable({ message: 'No tokens to send' });
    }

    return tokens;
  }
}

export class SendNotificationInteractorBuilder {
  static build(): SendNotificationInteractor {
    return new SendNotificationInteractor(new GetDeviceTokensRepository(), new SendPushNotificationRepository());
  }
}
