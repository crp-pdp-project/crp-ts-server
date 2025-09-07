import { RecoverSessionPayloadDTO } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { OTPConstants } from 'src/general/contants/otp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';

import { SessionType } from './session.model';
import { SessionModel } from './session.model';

export class RecoverSessionModel extends SessionModel {
  readonly type = SessionType.RECOVER;
  readonly patient: RecoverSessionPayloadDTO['patient'];
  readonly external: RecoverSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: RecoverSessionPayloadDTO) {
    super(session);

    this.patient = payload.patient;
    this.external = payload.external;
  }

  validateOtpLimit(): void {
    if ((this.otpSendCount ?? 0) >= OTPConstants.MAX_RECOVER_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }
  }
}
