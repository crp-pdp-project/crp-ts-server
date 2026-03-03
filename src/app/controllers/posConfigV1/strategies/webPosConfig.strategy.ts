import type { FastifyRequest } from 'fastify';

import type { POSConfigWebInputDTO } from 'src/app/entities/dtos/input/posConfigWeb.input.dto';
import { POSConfigWebBodyDTOSchema } from 'src/app/entities/dtos/input/posConfigWeb.input.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import type { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IPOSConfigInteractor } from 'src/app/interactors/posConfig/posConfig.interactor';
import { POSConfigInteractorBuilder } from 'src/app/interactors/posConfig/posConfig.interactor';
import { Audiences } from 'src/general/enums/audience.enum';

import type { IPOSConfigControllerStrategy } from '../posConfig.controller';

export class WebPosConfigControllerStrategy implements IPOSConfigControllerStrategy {
  constructor(private readonly interactor: IPOSConfigInteractor) {}
  async execute(input: FastifyRequest<POSConfigWebInputDTO>): Promise<POSConfigModel> {
    const clientIp = input.ip;
    const body = POSConfigWebBodyDTOSchema.parse(input.body);
    const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
    const device = DeviceModel.extractDevice(input.device);
    device.validateWebDevice();
    return this.interactor.config(session, device, body, clientIp);
  }
}

export class WebPosConfigControllerStrategyBuilder {
  static build(): WebPosConfigControllerStrategy {
    return new WebPosConfigControllerStrategy(POSConfigInteractorBuilder.buildWeb());
  }
}
