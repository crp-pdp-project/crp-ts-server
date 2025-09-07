import { RecoverSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { RecoverSessionModel } from 'src/app/entities/models/session/recoverSession.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export class ValidateRecoverSessionStrategy implements IValidateSessionStrategy {
  async generateSession(session: SessionDTO, payload: SessionPayloadDTO): Promise<RecoverSessionModel> {
    const { data, success } = RecoverSessionPayloadDTOSchema.safeParse({
      patient: payload.patient,
      external: payload.external,
    });

    if (!success || (!data.external.email && !data.external.phone)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return new RecoverSessionModel(session, data);
  }
}
