import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesRepository,
  PatientRelativesRepository,
} from 'src/app/repositories/database/patientRelatives.repository';

export interface IPatientRelativesInteractor {
  relatives(session: SignInSessionModel): Promise<PatientModel>;
}

export class PatientRelativesInteractor implements IPatientRelativesInteractor {
  constructor(private readonly patientRelatives: IPatientRelativesRepository) {}

  async relatives(session: SignInSessionModel): Promise<PatientModel> {
    const patientWithRelatives = await this.patientRelatives.execute(session.patient.id);

    return new PatientModel(patientWithRelatives);
  }
}

export class PatientRelativesInteractorBuilder {
  static build(): PatientRelativesInteractor {
    return new PatientRelativesInteractor(new PatientRelativesRepository());
  }
}
