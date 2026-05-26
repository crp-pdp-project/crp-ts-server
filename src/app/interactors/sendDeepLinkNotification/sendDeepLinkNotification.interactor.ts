import type {
  SendDeepLinkNotificationBodyDTO,
  SendDeepLinkNotificationParamsDTO,
} from 'src/app/entities/dtos/input/sendDeepLinkNotification.input.dto';
import type { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PushConfigModel } from 'src/app/entities/models/pushConfig/pushConfig.model';
import type { IGetDeviceTokensRepository } from 'src/app/repositories/database/getDeviceTokens.repository';
import { GetDeviceTokensRepository } from 'src/app/repositories/database/getDeviceTokens.repository';
import type { IGetPushConfigRepository } from 'src/app/repositories/database/getPushConfig.repository';
import { GetPushConfigRepository } from 'src/app/repositories/database/getPushConfig.repository';
import type { ISendPushNotificationRepository } from 'src/app/repositories/rest/sendPushNotifications.repository';
import { SendPushNotificationRepository } from 'src/app/repositories/rest/sendPushNotifications.repository';

export interface ISendDeepLinkNotificationInteractor {
  send(params: SendDeepLinkNotificationParamsDTO, body: SendDeepLinkNotificationBodyDTO): Promise<void>;
}

export class SendDeepLinkNotificationInteractor implements ISendDeepLinkNotificationInteractor {
  constructor(
    private readonly getDeviceTokens: IGetDeviceTokensRepository,
    private readonly getPushConfig: IGetPushConfigRepository,
    private readonly sendPushNotification: ISendPushNotificationRepository,
  ) {}

  async send(params: SendDeepLinkNotificationParamsDTO, body: SendDeepLinkNotificationBodyDTO): Promise<void> {
    const devices = await this.getDeviceArray(body);
    const validatedParams = await this.validateBoryParams(params, body);
    await this.sendPushNotification.execute({
      title: body.title,
      body: body.body,
      baseRoute: params.screen,
      params: validatedParams,
      devices,
    });
  }

  private async getDeviceArray(body: SendDeepLinkNotificationBodyDTO): Promise<DeviceDTO[]> {
    const devices = await this.getDeviceTokens.execute(body.documentType, body.documentNumber);

    const filteredDevices = body.device ? devices.filter((device) => device.os === body.device) : devices;

    if (filteredDevices.length === 0) {
      throw ErrorModel.unprocessable({ message: 'No tokens to send' });
    }

    return filteredDevices;
  }

  private async validateBoryParams(
    params: SendDeepLinkNotificationParamsDTO,
    body: SendDeepLinkNotificationBodyDTO,
  ): Promise<Record<string, unknown>> {
    const rawConfig = await this.getPushConfig.execute(params.screen);
    const configModel = new PushConfigModel(rawConfig);

    return configModel.isValidPayload(body.params);
  }
}

export class SendDeepLinkNotificationInteractorBuilder {
  static build(): SendDeepLinkNotificationInteractor {
    return new SendDeepLinkNotificationInteractor(
      new GetDeviceTokensRepository(),
      new GetPushConfigRepository(),
      new SendPushNotificationRepository(),
    );
  }
}
