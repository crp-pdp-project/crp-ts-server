import { EmployeeSessionDTO } from 'src/app/entities/dtos/service/employeeSession.dto';
import {
  EmployeeSessionPayloadDTO,
  EmployeeSessionPayloadDTOSchema,
} from 'src/app/entities/dtos/service/employeeSessionPayload.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { EmployeeSignInSessionModel } from 'src/app/entities/models/session/employeeSession.model';
import { IValidateSessionStrategy } from 'src/app/interactors/validateSession/validateSession.interactor';
import { IUpdateEmployeeSessionExpireRepository } from 'src/app/repositories/database/updateEmployeeSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

export class ValidateEmployeeSessionStrategy implements IValidateSessionStrategy {
  constructor(private readonly updateSessionExpire: IUpdateEmployeeSessionExpireRepository) {}

  async generateSession(
    session: EmployeeSessionDTO,
    payload: EmployeeSessionPayloadDTO,
    newExpireAt: string,
  ): Promise<EmployeeSignInSessionModel> {
    const { data, success } = EmployeeSessionPayloadDTOSchema.safeParse({ employee: payload.employee });

    if (!session.jti || !session.expiresAt || !success || DateHelper.isBeforeNow(session.expiresAt)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }
    await this.updateSessionExpire.execute(session.jti, data.employee.username, newExpireAt);

    return new EmployeeSignInSessionModel(session, data);
  }
}
