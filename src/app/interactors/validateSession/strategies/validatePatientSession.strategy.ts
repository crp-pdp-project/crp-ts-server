import type { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import type { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { SignInSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/signInSessionPayload.dto';
import type { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import type { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import type { IUpdateDevicePushTokenRepository } from 'src/app/repositories/database/updateDevicePushToken.repository';
import { UpdateDevicePushTokenRepository } from 'src/app/repositories/database/updateDevicePushToken.repository';
import type { IUpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import { UpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ValidatePatientSessionStrategy implements IValidateSessionStrategy {
  constructor(
    private readonly updateSessionExpire: IUpdateSessionExpireRepository,
    private readonly updateDevicePushToken: IUpdateDevicePushTokenRepository,
  ) {}

  async generateSession(
    session: SessionDTO,
    payload: SessionPayloadDTO,
    newExpireAt: string,
    device: DeviceModel,
  ): Promise<SignInSessionModel> {
    const { data, success } = SignInSessionPayloadDTOSchema.safeParse({ patient: payload.patient });

    if (!session.jti || !session.expiresAt || !success || DateHelper.isBefore(session.expiresAt)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }
    await this.updateSessionExpire.execute(session.jti, data.patient.id, newExpireAt);

    if (device.pushToken) {
      await this.updateDevicePushToken.execute(session.deviceId!, device.pushToken);
    }

    return new SignInSessionModel(session, data);
  }
}

export class ValidatePatientSessionStrategyBuilder {
  static build(): ValidatePatientSessionStrategy {
    return new ValidatePatientSessionStrategy(
      new UpdateSessionExpireRepository(),
      new UpdateDevicePushTokenRepository(),
    );
  }
}
