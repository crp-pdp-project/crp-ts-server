import { BaseModel } from 'src/app/entities/models/base.model';
import { OTPConstants } from 'src/general/contants/otp.constants';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { SessionDTO } from '../../dtos/service/session.dto';
import { ErrorModel } from '../error/error.model';

import { EnrollSessionModel } from './enrollSession.model';
import { RecoverSessionModel } from './recoverSession.model';
import { SignInSessionModel } from './signInSession.model';

type SessionTypeMap = {
  [Audiences.ENROLL]: EnrollSessionModel;
  [Audiences.RECOVER]: RecoverSessionModel;
  [Audiences.SIGN_IN]: SignInSessionModel;
};
export type SessionByType<T extends keyof SessionTypeMap> = SessionTypeMap[T];

export abstract class SessionModel extends BaseModel {
  readonly jti: string;
  readonly expiresAt: string;
  readonly otp: string | null;
  readonly otpSendCount: number | null;
  readonly isValidated: boolean;
  abstract readonly type: Audiences;

  constructor(session: SessionDTO) {
    super();

    this.jti = this.validateRequiredString(session.jti);
    this.expiresAt = this.validateRequiredString(session.expiresAt);
    this.otp = session.otp ?? null;
    this.otpSendCount = session.otpSendCount ?? null;
    this.isValidated = session.isValidated ?? false;
  }

  validateOtpLimit(): void {
    if ((this.otpSendCount ?? 0) >= OTPConstants.MAX_RECOVER_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }
  }

  validateSafeOperation(): void {
    if (!this.isValidated) {
      throw ErrorModel.precondition({ detail: ClientErrorMessages.SAFE_OPERATION_NOT_ALLOWED });
    }
  }

  private validateRequiredString(value?: string | null): string {
    if (!value) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return value;
  }

  static validateSessionInstance<T extends keyof SessionTypeMap>(
    expected: T,
    session?: SessionModel,
  ): SessionByType<T> {
    const validatedSession = this.validateRawSession(session);
    if (validatedSession.type !== expected) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session as SessionByType<T>;
  }

  static validateRawSession(session?: SessionModel): SessionModel {
    if (!session) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session;
  }
}
