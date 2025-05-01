import { FastifyRequest } from 'fastify';

import {
  ValidateRecoverOTPBodyDTO,
  ValidateRecoverOTPBodyDTOSchema,
  ValidateRecoverOTPInputDTO,
} from 'src/app/entities/dtos/input/validateRecoverOtp.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { IValidateSessionOTPRepository } from 'src/app/repositories/database/validateSessionOTP.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

export interface IValidateRecoverOTPInteractor {
  validate(input: FastifyRequest): Promise<void | ErrorModel>;
}

export class ValidateRecoverOTPInteractor implements IValidateRecoverOTPInteractor {
  constructor(private readonly validateSessionOtp: IValidateSessionOTPRepository) {}

  async validate(input: FastifyRequest<ValidateRecoverOTPInputDTO>): Promise<void | ErrorModel> {
    try {
      const session = this.validateSession(input.session);
      const body = this.validateInput(input.body);
      this.validateOtpInSession(session, body);
      await this.persistValidation(session.jti!, session.patient!.id!);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): SessionModel {
    if (!session || !session.otp || !!session.isValidated) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }

    return session;
  }

  private validateInput(body: ValidateRecoverOTPBodyDTO): ValidateRecoverOTPBodyDTO {
    return ValidateRecoverOTPBodyDTOSchema.parse(body);
  }

  private validateOtpInSession(session: SessionModel, body: ValidateRecoverOTPBodyDTO): void {
    if (session.otp !== body.otp) {
      throw ErrorModel.forbidden(ClientErrorMessages.WRONG_OTP);
    }
  }

  private async persistValidation(jti: string, patientId: number): Promise<void> {
    await this.validateSessionOtp.execute(jti, patientId);
  }
}
