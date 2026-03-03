import type { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import type { GenerationResponse } from 'src/general/managers/jwt/jwt.manager';

import type { PatientExternalModel } from './patientExternal.model';

export class PatientExternalTokenModel extends BaseModel {
  readonly patientExternal: PatientExternalModel;
  readonly token: string;
  readonly #jti: string;
  readonly #expiresAt: string;

  constructor(patientExternal: PatientExternalModel, token: GenerationResponse) {
    super();

    this.patientExternal = patientExternal;
    this.token = token.jwt;
    this.#jti = token.jti;
    this.#expiresAt = token.expiresAt;
  }

  toPersisSessionPayload(): SessionDTO {
    return {
      patientId: this.patientExternal.id,
      deviceId: this.patientExternal.device?.id,
      jti: this.#jti,
      expiresAt: this.#expiresAt,
    };
  }
}
