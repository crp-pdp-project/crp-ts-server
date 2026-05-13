import type { ConfirmVerificationOTPBodyDTO } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import type { PatientModel } from 'src/app/entities/models/patient/patient.model';
import type { SessionModel } from 'src/app/entities/models/session/session.model';
import type { IValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';
import { ValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';

import { ConfirmAuthOTPStrategy } from './strategies/confirmAuthOtp.strategy';
import { ConfirmEnrollOTPStrategyBuilder } from './strategies/confirmEnrollOtp.strategy';
import { ConfirmRecoverOTPStrategyBuilder } from './strategies/confirmRecoverOtp.strategy';

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
      ConfirmEnrollOTPStrategyBuilder.build(),
      new ValidateSessionOTPRepository(),
    );
  }

  static buildRecover(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(
      ConfirmRecoverOTPStrategyBuilder.build(),
      new ValidateSessionOTPRepository(),
    );
  }

  static buildAuth(): ConfirmVerificationOTPInteractor {
    return new ConfirmVerificationOTPInteractor(new ConfirmAuthOTPStrategy(), new ValidateSessionOTPRepository());
  }
}
