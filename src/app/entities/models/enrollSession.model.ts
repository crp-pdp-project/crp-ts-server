import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';

import { EnrollSessionPayloadDTO } from '../dtos/service/EnrollsessionPayload.dto';

import { SessionModel } from './session.model';

export class EnrollSessionModel extends SessionModel {
  readonly patient: EnrollSessionPayloadDTO['patient'];
  readonly external: EnrollSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: EnrollSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }
}
