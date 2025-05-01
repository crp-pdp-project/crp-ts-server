import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ValidateRecoverSessionStrategy implements IValidateSessionStrategy {
  async validateSession(payload: SessionDTO): Promise<void> {
    if (
      !payload.jti ||
      !payload.account?.id ||
      !payload.expiresAt ||
      !payload.patient?.id ||
      (!payload.payload?.email && !payload.payload?.phone) ||
      DateHelper.checkExpired(payload.expiresAt)
    ) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }
}
