import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { Audiences } from 'src/general/enums/audience.enum';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';

import { ISendVerificationOTPStrategy } from '../sendVerificationOtp.interactor';

export class SendEnrollOTPStrategy implements ISendVerificationOTPStrategy {
  private readonly flow: AuthFlowIdentifier = AuthFlowIdentifier.ENROLL;
  private readonly subject: EmailSubjects = EmailSubjects.ENROLL_SUBJECT;

  constructor(private readonly getAuthAttempt: IGetAuthAttemptsRepository) {}

  async validate(session: SessionModel): Promise<PatientExternalModel> {
    const enrollSession = this.validateSession(session);
    const attemptModel = await this.fetchAttempt(enrollSession.patient.documentNumber);
    attemptModel.validateAttempt();
    const patientModel = this.extractModel(enrollSession);

    return patientModel;
  }

  getSubject(): EmailSubjects {
    return this.subject;
  }

  private validateSession(session: SessionModel): EnrollSessionModel {
    const model = SessionModel.validateSessionInstance(Audiences.ENROLL, session);
    model.validateOtpLimit();

    return model;
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.flow);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, this.flow);
    return attemptModel;
  }

  private extractModel(session: EnrollSessionModel): PatientExternalModel {
    const model = new PatientExternalModel(
      {
        ...session.external,
        ...session.patient,
      },
      session.patient,
    );

    return model;
  }
}
