import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { BaseModel } from 'src/app/entities/models/base.model';

export abstract class SessionModel extends BaseModel {
  readonly jti: string;
  readonly otp: string | null;
  readonly isValidated: boolean;
  readonly expiresAt: string;

  constructor(session: SessionDTO) {
    super();

    this.jti = session.jti ?? '';
    this.otp = session.otp ?? '';
    this.isValidated = session.isValidated ?? false;
    this.expiresAt = session.expiresAt ?? '';
  }
}
