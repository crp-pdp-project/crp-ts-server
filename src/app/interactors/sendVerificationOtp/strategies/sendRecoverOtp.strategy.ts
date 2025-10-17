import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { PatientExternalModel } from 'src/app/entities/models/patient/patientExternal.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { Audiences } from 'src/general/enums/audience.enum';
import { EmailSubjects } from 'src/general/enums/emailSubject.enum';

import { ISendVerificationOTPStrategy } from '../sendVerificationOtp.interactor';

export class SendRecoverOTPStrategy implements ISendVerificationOTPStrategy {
  private readonly flow: AuthFlowIdentifier = AuthFlowIdentifier.RECOVER;
  private readonly subject: EmailSubjects = EmailSubjects.RECOVER_SUBJECT;

  constructor(private readonly getAuthAttempt: IGetAuthAttemptsRepository) {}

  async validate(session: SessionModel): Promise<PatientExternalModel> {
    const recoverSession = this.validateSession(session);
    const attemptModel = await this.fetchAttempt(recoverSession.patient.documentNumber);
    attemptModel.validateAttempt();
    const patientModel = this.extractModel(recoverSession);

    return patientModel;
  }

  getSubject(): EmailSubjects {
    return this.subject;
  }

  private validateSession(session: SessionModel): RecoverSessionModel {
    const model = SessionModel.validateSessionInstance(Audiences.RECOVER, session);
    model.validateOtpLimit();

    return model;
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.flow);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, this.flow);
    return attemptModel;
  }

  private extractModel(session: RecoverSessionModel): PatientExternalModel {
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
