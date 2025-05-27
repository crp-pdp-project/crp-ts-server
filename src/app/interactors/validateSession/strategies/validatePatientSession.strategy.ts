import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { SignInSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/signInSessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { IUpdateSessionExpireRepository } from 'src/app/repositories/database/updateSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ValidateSignInSessionStrategy implements IValidateSessionStrategy {
  constructor(private readonly updateSessionExpire: IUpdateSessionExpireRepository) {}

  async generateSession(
    session: SessionDTO,
    payload: SessionPayloadDTO,
    newExpireAt: string,
  ): Promise<SignInSessionModel> {
    const { data, success } = SignInSessionPayloadDTOSchema.safeParse({ patient: payload.patient });

    if (!session.jti || !session.expiresAt || !success || DateHelper.checkExpired(session.expiresAt)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }
    await this.updateSessionExpire.execute(session.jti, data.patient.id, newExpireAt);

    return new SignInSessionModel(session, data);
  }
}
