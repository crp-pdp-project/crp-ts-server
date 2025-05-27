import { FastifyRequest } from 'fastify';

import {
  ValidateVerificationOTPBodyDTO,
  ValidateVerificationOTPBodyDTOSchema,
  ValidateVerificationOTPInputDTO,
} from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { EnrollSessionModel } from 'src/app/entities/models/enrollSession.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { RecoverSessionModel } from 'src/app/entities/models/recoverSession.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { IAuthAttemptManager } from 'src/general/managers/authAttempt.manager';

export interface IValidateVerificationOTPInteractor {
  validate(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class ValidateVerificationOTPInteractor implements IValidateVerificationOTPInteractor {
  constructor(
    private readonly authAttemptManager: IAuthAttemptManager,
    private readonly validateSessionOtp: IValidateSessionOTPRepository,
  ) {}

  async validate(input: FastifyRequest<ValidateVerificationOTPInputDTO>): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const body = this.validateInput(input.body);
      const attempt = await this.authAttemptManager.validateAttempt(session.patient.documentNumber);
      await this.verifyOtp(session, body, attempt);
      await this.persistValidation(session.jti, session.patient.id);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): RecoverSessionModel | EnrollSessionModel {
    const typeInvalid = !(session instanceof RecoverSessionModel) && !(session instanceof EnrollSessionModel);
    if (typeInvalid || !session.otp || !!session.isValidated) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }

  private validateInput(body: ValidateVerificationOTPBodyDTO): ValidateVerificationOTPBodyDTO {
    return ValidateVerificationOTPBodyDTOSchema.parse(body);
  }

  private async verifyOtp(
    session: RecoverSessionModel | EnrollSessionModel,
    body: ValidateVerificationOTPBodyDTO,
    attempt?: AuthAttemptsDTO,
  ): Promise<void> {
    if (session.otp !== body.otp) {
      await this.authAttemptManager.handleFailure(session.patient.documentNumber, attempt);
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.WRONG_OTP });
    }
    await this.authAttemptManager.handleSuccess(attempt);
  }

  private async persistValidation(jti: string, patientId: number): Promise<void> {
    await this.validateSessionOtp.execute(jti, patientId);
  }
}
