import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';

import { EnrollSessionModel } from './enrollSession.model';
import { RecoverSessionModel } from './recoverSession.model';
import { SignInSessionModel } from './signInSession.model';

export enum SessionType {
  ENROLL = 'enroll',
  RECOVER = 'recover',
  SIGN_IN = 'signIn',
}

type SessionByType<T extends SessionType> = T extends SessionType.ENROLL
  ? EnrollSessionModel
  : T extends SessionType.RECOVER
    ? RecoverSessionModel
    : T extends SessionType.SIGN_IN
      ? SignInSessionModel
      : never;

export abstract class SessionModel extends BaseModel {
  readonly jti: string;
  readonly otp: string | null;
  readonly otpSendCount: number | null;
  readonly isValidated: boolean;
  readonly expiresAt: string;
  abstract readonly type: SessionType;

  constructor(session: SessionDTO) {
    super();

    this.jti = session.jti ?? '';
    this.otp = session.otp ?? null;
    this.otpSendCount = session.otpSendCount ?? null;
    this.isValidated = session.isValidated ?? false;
    this.expiresAt = session.expiresAt ?? '';
  }

  static validateSessionInstance<T extends SessionType>(expected: T, session?: SessionModel): SessionByType<T> {
    if (!session || session.type !== expected) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session as SessionByType<T>;
  }
}
