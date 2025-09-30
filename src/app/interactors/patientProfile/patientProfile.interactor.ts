import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IPatientProfileInteractor {
  profile(session: SignInSessionModel): Promise<PatientExternalModel>;
}

export class PatientProfileInteractor implements IPatientProfileInteractor {
  constructor(private readonly searchPatientRepository: ISearchPatientRepository) {}

  async profile(session: SignInSessionModel): Promise<PatientExternalModel> {
    const externalPatientModel = await this.searchPatient(session);
    externalPatientModel.validatePatient();
    return externalPatientModel;
  }

  private async searchPatient(session: SignInSessionModel): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });
    const externalPatientModel = new PatientExternalModel(searchResult, session.patient);

    return externalPatientModel;
  }
}

export class PatientProfileInteractorBuilder {
  static build(): PatientProfileInteractor {
    return new PatientProfileInteractor(new SearchPatientRepository());
  }
}
