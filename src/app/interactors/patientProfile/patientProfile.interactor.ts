import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ISearchPatientRepository, SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

export interface IPatientProfileInteractor {
  profile(session: SignInSessionModel): Promise<PatientExternalModel>;
}

export class PatientProfileInteractor implements IPatientProfileInteractor {
  constructor(private readonly searchPatientRepository: ISearchPatientRepository) {}

  async profile(session: SignInSessionModel): Promise<PatientExternalModel> {
    const externalPatientModel = await this.searchPatient({ fmpId: session.patient.fmpId });
    externalPatientModel.validatePatient();
    return externalPatientModel;
  }

  private async searchPatient(searchPayload: PatientDTO): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute(searchPayload);

    const externalPatientModel = new PatientExternalModel(searchResult);

    return externalPatientModel;
  }
}

export class PatientProfileInteractorBuilder {
  static build(): PatientProfileInteractor {
    return new PatientProfileInteractor(new SearchPatientRepository());
  }
}
