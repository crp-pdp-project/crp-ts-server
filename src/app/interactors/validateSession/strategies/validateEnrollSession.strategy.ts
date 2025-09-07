import { EnrollSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/enrollSessionPayload.dto';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { EnrollSessionModel } from 'src/app/entities/models/session/enrollSession.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export class ValidateEnrollSessionStrategy implements IValidateSessionStrategy {
  async generateSession(session: SessionDTO, payload: SessionPayloadDTO): Promise<EnrollSessionModel> {
    const { data, success } = EnrollSessionPayloadDTOSchema.safeParse({
      patient: payload.patient,
      external: payload.external,
    });

    if (!success || (!data.external.email && !data.external.phone)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return new EnrollSessionModel(session, data);
  }
}
