import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientModel } from 'src/app/entities/models/patient/patient.model';
import { GenerationResponse } from 'src/general/managers/jwt/jwt.manager';

export class PatientTokenModel extends BaseModel {
  readonly patient: PatientModel;
  readonly token: string;
  readonly #jti: string;
  readonly #expiresAt: string;

  constructor(patient: PatientModel, token: GenerationResponse) {
    super();

    this.patient = patient;
    this.token = token.jwt;
    this.#jti = token.jti;
    this.#expiresAt = token.expiresAt;
  }

  toPersisSessionPayload(): SessionDTO {
    return {
      patientId: this.patient.id,
      deviceId: this.patient.device?.id,
      jti: this.#jti,
      expiresAt: this.#expiresAt,
    };
  }
}
