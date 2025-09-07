import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { ConfirmVerificationOTPBodyDTO } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { AuthAttemptModel, AuthFlowIdentifier } from 'src/app/entities/models/authAttempt/authAttempt.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { CleanBlockedRepository, ICleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import {
  GetAuthAttemptsRepository,
  IGetAuthAttemptsRepository,
} from 'src/app/repositories/database/getAuthAttempts.repository';
import {
  IUpdateBlockedRepository,
  UpdateBlockedRepository,
} from 'src/app/repositories/database/updateBlocked.repository';
import {
  IUpsertTryCountRepository,
  UpsertTryCountRepository,
} from 'src/app/repositories/database/upsertTryCount.repository';
import {
  IValidateSessionOTPRepository,
  ValidateSessionOTPRepository,
} from 'src/app/repositories/database/validateSessionOTP.repository';

type CombinedTransacSession = EnrollSessionModel | RecoverSessionModel;

export interface IConfirmVerificationOTPInteractor {
  confirm(body: ConfirmVerificationOTPBodyDTO, session: CombinedTransacSession): Promise<void>;
}

export class ConfirmVerificationOTPInteractor implements IConfirmVerificationOTPInteractor {
  constructor(
    private readonly flowIdentifier: AuthFlowIdentifier,
    private readonly getAuthAttempt: IGetAuthAttemptsRepository,
    private readonly upsertTryCount: IUpsertTryCountRepository,
    private readonly updateBlocked: IUpdateBlockedRepository,
    private readonly cleanBlocked: ICleanBlockedRepository,
    private readonly validateSessionOtp: IValidateSessionOTPRepository,
  ) {}

  async confirm(body: ConfirmVerificationOTPBodyDTO, session: CombinedTransacSession): Promise<void> {
    const attemptModel = await this.fetchAttempt(session.patient.documentNumber);
    attemptModel.validateAttempt();
    await this.verifyOtp(session, body, attemptModel);
    await this.persistValidation(session.jti, session.patient.id);
  }

  private async fetchAttempt(documentNumber: AuthAttemptDM['documentNumber']): Promise<AuthAttemptModel> {
    const attempt = await this.getAuthAttempt.execute(documentNumber, this.flowIdentifier);
    const attemptModel = new AuthAttemptModel({ ...attempt, documentNumber }, this.flowIdentifier);
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

  private async verifyOtp(
    session: CombinedTransacSession,
    body: ConfirmVerificationOTPBodyDTO,
    attempt: AuthAttemptModel,
  ): Promise<void> {
    if (session.otp === body.otp) {
      await this.cleanBlocked.execute(attempt.documentNumber);
    } else {
      await this.handleAttemptFailure(attempt);
    }
  }

  private async persistValidation(jti: string, patientId: number): Promise<void> {
    await this.validateSessionOtp.execute(jti, patientId);
  }
}

export class ConfirmVerificationOTPInteractorBuilder {
  static buildEnroll(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(
      AuthFlowIdentifier.ENROLL,
      new GetAuthAttemptsRepository(),
      new UpsertTryCountRepository(),
      new UpdateBlockedRepository(),
      new CleanBlockedRepository(),
      new ValidateSessionOTPRepository(),
    );
  }

  static buildRecover(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(
      AuthFlowIdentifier.RECOVER,
      new GetAuthAttemptsRepository(),
      new UpsertTryCountRepository(),
      new UpdateBlockedRepository(),
      new CleanBlockedRepository(),
      new ValidateSessionOTPRepository(),
    );
  }
}
