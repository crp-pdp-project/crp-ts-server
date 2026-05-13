import type { FastifyRequest } from 'fastify';

import { DeviceModel } from 'src/app/entities/models/device/device.model';
import type { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IPOSConfigInteractor } from 'src/app/interactors/posConfig/posConfig.interactor';
import { POSConfigInteractorBuilder } from 'src/app/interactors/posConfig/posConfig.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import type { IPOSConfigControllerStrategy } from '../posConfig.controller';

export class MobilePosConfigControllerStrategy implements IPOSConfigControllerStrategy {
  constructor(private readonly interactor: IPOSConfigInteractor) {}
  async execute(input: FastifyRequest): Promise<POSConfigModel> {
    const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
    const device = DeviceModel.extractDevice(input.device);
    device.validateMobileDevice();
    return this.interactor.config(session, device);
  }
}

export class MobilePosConfigControllerStrategyBuilder {
  static build(): MobilePosConfigControllerStrategy {
    return new MobilePosConfigControllerStrategy(POSConfigInteractorBuilder.buildMobile());
  }
}
