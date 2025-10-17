import { ConfirmVerificationOTPBodyDTO } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { CleanBlockedRepository } from 'src/app/repositories/database/cleanBlocked.repository';
import { GetAuthAttemptsRepository } from 'src/app/repositories/database/getAuthAttempts.repository';
import { UpdateBlockedRepository } from 'src/app/repositories/database/updateBlocked.repository';
import { UpsertTryCountRepository } from 'src/app/repositories/database/upsertTryCount.repository';
import {
  IValidateSessionOTPRepository,
  ValidateSessionOTPRepository,
} from 'src/app/repositories/database/validateSessionOTP.repository';

import { ConfirmAuthOTPStrategy } from './strategies/confirmAuthOtp.strategy';
import { ConfirmEnrollOTPStrategy } from './strategies/confirmEnrollOtp.strategy';
import { ConfirmRecoverOTPStrategy } from './strategies/confirmRecoverOtp.strategy';

export interface IConfirmVerificationOTPStrategy {
  validate(session: SessionModel, otp: string): Promise<PatientModel>;
}

export interface IConfirmVerificationOTPInteractor {
  confirm(body: ConfirmVerificationOTPBodyDTO, session: SessionModel): Promise<void>;
}

export class ConfirmVerificationOTPInteractor implements IConfirmVerificationOTPInteractor {
  constructor(
    private readonly confirmVerificationStrategy: IConfirmVerificationOTPStrategy,
    private readonly validateSessionOtp: IValidateSessionOTPRepository,
  ) {}

  async confirm(body: ConfirmVerificationOTPBodyDTO, session: SessionModel): Promise<void> {
    const patient = await this.confirmVerificationStrategy.validate(session, body.otp);
    await this.persistValidation(session.jti, patient.id!);
  }

  private async persistValidation(jti: string, patientId: number): Promise<void> {
    await this.validateSessionOtp.execute(jti, patientId);
  }
}

export class ConfirmVerificationOTPInteractorBuilder {
  static buildEnroll(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(
      new ConfirmEnrollOTPStrategy(
        new GetAuthAttemptsRepository(),
        new UpsertTryCountRepository(),
        new UpdateBlockedRepository(),
        new CleanBlockedRepository(),
      ),
      new ValidateSessionOTPRepository(),
    );
  }

  static buildRecover(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(
      new ConfirmRecoverOTPStrategy(
        new GetAuthAttemptsRepository(),
        new UpsertTryCountRepository(),
        new UpdateBlockedRepository(),
        new CleanBlockedRepository(),
      ),
      new ValidateSessionOTPRepository(),
    );
  }

  static buildAuth(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(new ConfirmAuthOTPStrategy(), new ValidateSessionOTPRepository());
  }
}
