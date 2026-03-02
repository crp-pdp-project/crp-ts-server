import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IInformInsuranceInterestRepository } from 'src/app/repositories/rest/informInsuranceInterest.repository';
import { InformInsuranceInterestRepository } from 'src/app/repositories/rest/informInsuranceInterest.repository';
import type { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IInformInsuranceInterestInteractor {
  inform(session: SignInSessionModel): Promise<void>;
}

export class InformInsuranceInterestInteractor implements IInformInsuranceInterestInteractor {
  constructor(
    private readonly searchPatientRepository: ISearchPatientRepository,
    private readonly informInsuranceInterest: IInformInsuranceInterestRepository,
  ) {}

  async inform(session: SignInSessionModel): Promise<void> {
    const patientExternalModel = await this.searchPatient(session.patient.fmpId);
    await this.informInsuranceInterest.execute(patientExternalModel);
  }

  private async searchPatient(fmpId: PatientDM['fmpId']): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const externalPatientModel = new PatientExternalModel(searchResult);

    return externalPatientModel;
  }
}

export class InformInsuranceInterestInteractorBuilder {
  static build(): InformInsuranceInterestInteractor {
    return new InformInsuranceInterestInteractor(
      new SearchPatientRepository(),
      new InformInsuranceInterestRepository(),
    );
  }
}
