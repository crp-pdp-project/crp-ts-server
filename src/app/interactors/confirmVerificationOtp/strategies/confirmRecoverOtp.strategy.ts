import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { IGetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { IUpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { IUpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import { Audiences } from 'src/general/enums/audience.enum';

import { IConfirmVerificationOTPStrategy } from '../confirmVerificationOtp.interactor';

export class ConfirmRecoverOTPStrategy implements IConfirmVerificationOTPStrategy {
  private readonly flow: AuthFlowIdentifier = AuthFlowIdentifier.RECOVER;

  constructor(
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly upsertTryCount: IUpsertTryCountRepository,
    private readonly updateBlocked: IUpdateBlockedRepository,
    private readonly cleanBlocked: ICleanBlockedRepository,
  ) {}

  async validate(session: SessionModel, otp: string): Promise<PatientModel> {
    const recoverSession = this.validateSession(session);
    const attemptModel = await this.fetchAttempt(recoverSession.patient.documentNumber);
    attemptModel.validateAttempt();
    await this.verifyOtp(recoverSession, otp, attemptModel);
    const model = this.extractModel(recoverSession);

    return model;
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

  private async handleAttemptFailure(attempt: AuthAttemptModel): Promise<void> {
    const isBlocked = attempt.isBlockedAfterFailure();

    if (isBlocked) {
      await this.updateBlocked.execute(attempt.id!, attempt.blockExpiresAt!);
      throw ErrorModel.locked({ detail: attempt.authAttemptConfig.blockErrorMessage });
    }

    await this.upsertTryCount.execute({
      documentNumber: attempt.documentNumber,
      flowIdentifier: attempt.flowIdentifier,
      tryCount: attempt.tryCount,
      tryCountExpiresAt: attempt.tryCountExpiresAt,
    });
    throw ErrorModel.unauthorized({ detail: attempt.authAttemptConfig.tryErrorMessage });
  }

  private async verifyOtp(session: SessionModel, otp: string, attempt: AuthAttemptModel): Promise<void> {
    if (session.otp === otp) {
      await this.cleanBlocked.execute(attempt.documentNumber);
    } else {
      await this.handleAttemptFailure(attempt);
    }
  }

  private extractModel(session: RecoverSessionModel): PatientModel {
    const model = new PatientModel(session.patient);

    return model;
  }
}
