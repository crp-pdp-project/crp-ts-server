import type { SendNotificationBodyDTO } from 'src/app/entities/dtos/input/sendNotification.input.dto';
import type { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { IGetDeviceTokensRepository } from 'src/app/repositories/database/getDeviceTokens.repository';
import { GetDeviceTokensRepository } from 'src/app/repositories/database/getDeviceTokens.repository';
import type { ISendPushNotificationRepository } from 'src/app/repositories/rest/sendPushNotifications.repository';
import { SendPushNotificationRepository } from 'src/app/repositories/rest/sendPushNotifications.repository';

export interface ISendNotificationInteractor {
  send(body: SendNotificationBodyDTO): Promise<void>;
}

export class SendNotificationInteractor implements ISendNotificationInteractor {
  constructor(
    private readonly getDeviceTokens: IGetDeviceTokensRepository,
    private readonly sendPushNotification: ISendPushNotificationRepository,
  ) {}

  async send(body: SendNotificationBodyDTO): Promise<void> {
    const devices = await this.getDeviceArray(body);
    await this.sendPushNotification.execute({
      title: body.title,
      body: body.body,
      // NOSONAR
      // url: body.url,
      devices,
    });
  }

  private async getDeviceArray(body: SendNotificationBodyDTO): Promise<DeviceDTO[]> {
    const devices = await this.getDeviceTokens.execute(body.documentType, body.documentNumber);

    const filteredDevices = body.device ? devices.filter((device) => device.os === body.device) : devices;

    if (filteredDevices.length === 0) {
      throw ErrorModel.unprocessable({ message: 'No tokens to send' });
    }

    return filteredDevices;
  }
}

export class SendNotificationInteractorBuilder {
  static build(): SendNotificationInteractor {
    return new SendNotificationInteractor(new GetDeviceTokensRepository(), new SendPushNotificationRepository());
  }
}
