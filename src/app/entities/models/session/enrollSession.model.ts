import { EnrollSessionPayloadDTO } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { OTPConstants } from 'src/general/contants/otp.constants';
import { Audiences } from 'src/general/enums/audience.enum';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { ErrorModel } from '../error/error.model';

import { SessionModel } from './session.model';

export class EnrollSessionModel extends SessionModel {
  readonly type = Audiences.ENROLL;
  readonly otp: string | null;
  readonly otpSendCount: number | null;
  readonly isValidated: boolean;
  readonly patient: EnrollSessionPayloadDTO['patient'];
  readonly external: EnrollSessionPayloadDTO['external'];

  constructor(session: SessionDTO, payload: EnrollSessionPayloadDTO) {
    super(session.jti, session.expiresAt);

    this.otp = session.otp ?? null;
    this.otpSendCount = session.otpSendCount ?? null;
    this.isValidated = session.isValidated ?? false;
    this.patient = payload.patient;
    this.external = payload.external;
  }

  validateOtpLimit(): void {
    if ((this.otpSendCount ?? 0) >= OTPConstants.MAX_ENROLL_SEND_COUNT) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.OTP_SEND_LIMIT });
    }
  }
}
