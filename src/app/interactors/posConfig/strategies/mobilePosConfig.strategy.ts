import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { GetPOSConfigRepository, IGetPOSConfigRepository } from 'src/app/repositories/rest/getPosConfig.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

import { IPOSConfigStrategy } from '../posConfig.interactor';

export class MobilePOSConfigStrategy implements IPOSConfigStrategy {
  constructor(
    private readonly getPOSConfig: IGetPOSConfigRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
  ) {}

  async getModel(session: SignInSessionModel, device: DeviceModel): Promise<POSConfigModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });
    const posConfig = await this.getPOSConfig.execute(device.os!);
    const model = new POSConfigModel(posConfig, session, searchResult);

    return model;
  }
}

export class MobilePOSConfigStrategyBuilder {
  static build(): MobilePOSConfigStrategy {
    return new MobilePOSConfigStrategy(new GetPOSConfigRepository(), new SearchPatientRepository());
  }
}
