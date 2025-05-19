import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';

import { SignInSessionPayloadDTO } from '../dtos/service/signInSessionPayload.dto';

import { SessionModel } from './session.model';

export class SignInSessionModel extends SessionModel {
  readonly patient: SignInSessionPayloadDTO['patient'];

  constructor(session: SessionDTO, payload: SignInSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
  }
}
