import {
  SendDeepLinkNotificationBodyDTO,
  SendDeepLinkNotificationParamsDTO,
} from 'src/app/entities/dtos/input/sendDeepLinkNotification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PushConfigModel } from 'src/app/entities/models/pushConfig/pushConfig.model';
import {
  GetDeviceTokensRepository,
  IGetDeviceTokensRepository,
} from 'src/app/repositories/database/getDeviceTokens.repository';
import {
  GetPushConfigRepository,
  IGetPushConfigRepository,
} from 'src/app/repositories/database/getPushConfig.repository';
import {
  ISendPushNotificationRepository,
  SendPushNotificationRepository,
} from 'src/app/repositories/rest/sendPushNotifications.repository';

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
    const tokens = await this.getTokenArray(body);
    const validatedParams = await this.validateBoryParams(params, body);
    await this.sendPushNotification.execute(body.device, {
      title: body.title,
      body: body.body,
      baseRoute: params.screen,
      params: validatedParams,
      tokens,
    });
  }

  private async getTokenArray(body: SendDeepLinkNotificationBodyDTO): Promise<string[]> {
    const devices = await this.getDeviceTokens.execute(body.documentType, body.documentNumber);

    const tokens = devices.flatMap(({ pushToken }) => pushToken ?? []);

    if (tokens.length === 0) {
      throw ErrorModel.unprocessable({ message: 'No tokens to send' });
    }

    return tokens;
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
