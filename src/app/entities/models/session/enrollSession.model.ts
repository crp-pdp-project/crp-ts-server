import { EnrollSessionPayloadDTO } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { OTPConstants } from 'src/general/contants/otp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';

import { SessionType } from './session.model';
import { SessionModel } from './session.model';

export class EnrollSessionModel extends SessionModel {
  readonly type = SessionType.ENROLL;
  readonly patient: EnrollSessionPayloadDTO['patient'];
  readonly external: EnrollSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: EnrollSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }

  validateOtpLimit(): void {
    if ((this.otpSendCount ?? 0) >= OTPConstants.MAX_ENROLL_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }
  }
}
