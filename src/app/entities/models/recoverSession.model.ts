import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';

import { RecoverSessionPayloadDTO } from '../dtos/service/recoverSessionPayload.dto';

import { SessionModel } from './session.model';

export class RecoverSessionModel extends SessionModel {
  readonly patient: RecoverSessionPayloadDTO['patient'];
  readonly external: RecoverSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: RecoverSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }
}
