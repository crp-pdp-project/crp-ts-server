import type { POSConfigWebBodyDTO } from 'src/app/entities/dtos/input/posConfigWeb.input.dto';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import type { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';

import { MobilePOSConfigStrategyBuilder } from './strategies/mobilePosConfig.strategy';
import { WebPOSConfigStrategyBuilder } from './strategies/webPosConfig.strategy';

export interface IPOSConfigStrategy {
  getModel(
    session: SignInSessionModel,
    device: DeviceModel,
    body?: POSConfigWebBodyDTO,
    clientIp?: string,
  ): Promise<POSConfigModel>;
}
export interface IPOSConfigInteractor {
  config(
    session: SignInSessionModel,
    device: DeviceModel,
    body?: POSConfigWebBodyDTO,
    clientIp?: string,
  ): Promise<POSConfigModel>;
}

export class POSConfigInteractor implements IPOSConfigInteractor {
  constructor(private readonly POSConfigStrategy: IPOSConfigStrategy) {}

  async config(
    session: SignInSessionModel,
    device: DeviceModel,
    body?: POSConfigWebBodyDTO,
    clientIp?: string,
  ): Promise<POSConfigModel> {
    const model = await this.POSConfigStrategy.getModel(session, device, body, clientIp);

    return model;
  }
}

export class POSConfigInteractorBuilder {
  static buildWeb(): POSConfigInteractor {
    return new POSConfigInteractor(WebPOSConfigStrategyBuilder.build());
  }

  static buildMobile(): POSConfigInteractor {
    return new POSConfigInteractor(MobilePOSConfigStrategyBuilder.build());
  }
}
