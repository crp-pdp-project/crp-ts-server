import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { IUpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ValidateUserSessionStrategy implements IValidateSessionStrategy {
  constructor(private readonly updateSessionExpire: IUpdateSessionExpireRepository) {}

  async validateSession(payload: SessionDTO, newExpireAt: string): Promise<void> {
    if (
      !payload.jti ||
      !payload.account?.id ||
      !payload.expiresAt ||
      !payload.patient?.id ||
      DateHelper.checkExpired(payload.expiresAt)
    ) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
    await this.updateSessionExpire.execute(payload.jti, payload.patient.id, newExpireAt);
  }
}
