import { POSConfigWebBodyDTO } from 'src/app/entities/dtos/input/posConfigWeb.input.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { GetPOSConfigRepository, IGetPOSConfigRepository } from 'src/app/repositories/rest/getPosConfig.repository';
import { GetPOSSessionRepository, IGetPOSSessionRepository } from 'src/app/repositories/rest/getPosSession.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

import { IPOSConfigStrategy } from '../posConfig.interactor';

export class WebPOSConfigStrategy implements IPOSConfigStrategy {
  constructor(
    private readonly getPOSConfig: IGetPOSConfigRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly getPOSSession: IGetPOSSessionRepository,
  ) {}

  async getModel(session: SignInSessionModel, device: DeviceModel, body: POSConfigWebBodyDTO): Promise<POSConfigModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });
    const posConfig = await this.getPOSConfig.execute(device.os!);
    const model = new POSConfigModel(posConfig, session, searchResult);
    const sessionToken = await this.getPOSSession.execute(device.os!, model.rawConfig!, body.amount, model.MDD!);
    model.inyectSessionToken(sessionToken);

    return model;
  }
}

export class WebPOSConfigStrategyBuilder {
  static build(): WebPOSConfigStrategy {
    return new WebPOSConfigStrategy(
      new GetPOSConfigRepository(),
      new SearchPatientRepository(),
      new GetPOSSessionRepository(),
    );
  }
}
