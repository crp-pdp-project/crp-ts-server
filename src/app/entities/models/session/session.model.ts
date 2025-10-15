import { BaseModel } from 'src/app/entities/models/base.model';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

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
  abstract readonly type: Audiences;

  constructor(jti?: string, expiresAt?: string) {
    super();

    this.jti = this.validateRequiredString(jti);
    this.expiresAt = this.validateRequiredString(expiresAt);
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
    if (!session || session.type !== expected) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return session as SessionByType<T>;
  }
}
