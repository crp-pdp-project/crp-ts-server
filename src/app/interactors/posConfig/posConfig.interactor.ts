import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { GetPOSConfigRepository, IGetPOSConfigRepository } from 'src/app/repositories/rest/getPosConfig.repository';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IPOSConfigInteractor {
  config(session: SignInSessionModel, device: DeviceModel): Promise<POSConfigModel>;
}

export class POSConfigInteractor implements IPOSConfigInteractor {
  constructor(
    private readonly getPOSConfig: IGetPOSConfigRepository,
    private readonly searchPatientRepository: ISearchPatientRepository,
  ) {}

  async config(session: SignInSessionModel, device: DeviceModel): Promise<POSConfigModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });
    const posConfig = await this.getPOSConfig.execute(device.os!);

    return new POSConfigModel(posConfig, session, searchResult);
  }
}

export class POSConfigInteractorBuilder {
  static build(): POSConfigInteractor {
    return new POSConfigInteractor(new GetPOSConfigRepository(), new SearchPatientRepository());
  }
}
