import { RecoverSessionPayloadDTO } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { OTPConstants } from 'src/general/contants/otp.constants';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';

import { SessionModel } from './session.model';

export class RecoverSessionModel extends SessionModel {
  readonly type = Audiences.RECOVER;
  readonly otp: string | null;
  readonly otpSendCount: number | null;
  readonly isValidated: boolean;
  readonly patient: RecoverSessionPayloadDTO['patient'];
  readonly external: RecoverSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: RecoverSessionPayloadDTO) {
    super(session.jti, session.expiresAt);

    this.otp = session.otp ?? null;
    this.otpSendCount = session.otpSendCount ?? null;
    this.isValidated = session.isValidated ?? false;
    this.patient = payload.patient;
    this.external = payload.external;
  }

  validateOtpLimit(): void {
    if ((this.otpSendCount ?? 0) >= OTPConstants.MAX_RECOVER_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }
  }
}
