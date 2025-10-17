import { RecoverSessionPayloadDTO } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { Audiences } from 'src/general/enums/audience.enum';

import { SessionModel } from './session.model';

export class RecoverSessionModel extends SessionModel {
  readonly type = Audiences.RECOVER;
  readonly patient: RecoverSessionPayloadDTO['patient'];
  readonly external: RecoverSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: RecoverSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }
}
