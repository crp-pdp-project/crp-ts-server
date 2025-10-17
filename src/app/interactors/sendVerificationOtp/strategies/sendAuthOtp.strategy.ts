import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ISearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';
import { Audiences } from 'src/general/enums/audience.enum';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';

import { ISendVerificationOTPStrategy } from '../sendVerificationOtp.interactor';

export class SendAuthOTPStrategy implements ISendVerificationOTPStrategy {
  private readonly subject: EmailSubjects = EmailSubjects.AUTH_SUBJECT;

  constructor(private readonly searchPatientRepository: ISearchPatientRepository) {}

  async validate(session: SessionModel): Promise<PatientExternalModel> {
    const signInSession = this.validateSession(session);
    const patientModel = this.searchPatient(signInSession);

    return patientModel;
  }

  getSubject(): EmailSubjects {
    return this.subject;
  }

  private validateSession(session: SessionModel): SignInSessionModel {
    const model = SessionModel.validateSessionInstance(Audiences.SIGN_IN, session);
    model.validateOtpLimit();

    return model;
  }

  private async searchPatient(session: SignInSessionModel): Promise<PatientExternalModel> {
    const searchResult = await this.searchPatientRepository.execute({ fmpId: session.patient.fmpId });
    const externalPatientModel = new PatientExternalModel(searchResult, session.patient);

    return externalPatientModel;
  }
}
