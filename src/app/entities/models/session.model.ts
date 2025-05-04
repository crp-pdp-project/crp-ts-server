import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export class SessionModel extends BaseModel {
  readonly id?: number;
  readonly jti?: string;
  readonly otp?: string | null;
  readonly isValidated?: boolean;
  readonly expiresAt?: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string;
  readonly patient?: PatientModel | null;
  readonly account?: AccountDTO | null;
  readonly payload?: SessionPayloadDTO | null;

  constructor(session: SessionDTO) {
    super();

    this.id = session.id;
    this.jti = session.jti;
    this.otp = session.otp;
    this.isValidated = session.isValidated;
    this.expiresAt = session.expiresAt;
    this.createdAt = session.createdAt;
    this.updatedAt = session.updatedAt;
    this.patient = session.patient ? new PatientModel(session.patient) : session.patient;
    this.account = session.account ? { id: session.account.id } : session.account;
    this.payload = session.payload
      ? {
          email: session.payload.email,
          phone: session.payload.phone,
        }
      : session.payload;
  }
}
