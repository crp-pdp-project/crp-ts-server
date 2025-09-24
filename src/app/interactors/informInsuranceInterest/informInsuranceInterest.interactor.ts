import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IInformInsuranceInterestInteractor {
  inform(session: SignInSessionModel): Promise<void>;
}

export class InformInsuranceInterestInteractor implements IInformInsuranceInterestInteractor {
  constructor(private readonly searchPatientRepository: ISearchPatientRepository) {}

  async inform(session: SignInSessionModel): Promise<void> {
    const patientExternalModel = await this.searchPatient(session.patient.fmpId);
    patientExternalModel.validatePatient();
  }

  private async searchPatient(fmpId: PatientDM['fmpId']): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId });
    const externalPatientModel = new PatientExternalModel(searchResult);

    return externalPatientModel;
  }
}

export class InformInsuranceInterestInteractorBuilder {
  static build(): InformInsuranceInterestInteractor {
    return new InformInsuranceInterestInteractor(new SearchPatientRepository());
  }
}
