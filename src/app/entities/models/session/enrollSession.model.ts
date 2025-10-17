import { EnrollSessionPayloadDTO } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { Audiences } from 'src/general/enums/audience.enum';

import { SessionModel } from './session.model';

export class EnrollSessionModel extends SessionModel {
  readonly type = Audiences.ENROLL;
  readonly patient: EnrollSessionPayloadDTO['patient'];
  readonly external: EnrollSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: EnrollSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }
}
