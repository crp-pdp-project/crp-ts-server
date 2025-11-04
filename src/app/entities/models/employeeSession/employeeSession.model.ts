import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { EmployeeSessionDTO } from '../../dtos/service/employeeSession.dto';
import { EmployeeSessionPayloadDTO } from '../../dtos/service/employeeSessionPayload.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';

export class EmployeeSessionModel extends BaseModel {
  readonly employee: EmployeeSessionPayloadDTO['employee'];
  readonly jti: string;
  readonly username: string;

  #expiresAt: string;

  constructor(payload: EmployeeSessionPayloadDTO, session?: EmployeeSessionDTO) {
    super();

    this.employee = payload.employee;
    this.jti = this.validateRequiredString(session?.jti);
    this.#expiresAt = this.validateRequiredString(session?.expiresAt);
    this.username = this.validateRequiredString(session?.username);
  }

  get expiresAt(): string {
    return this.#expiresAt;
  }

  refreshExiresAt(expiresAt: string): this {
    this.#expiresAt = expiresAt;

    return this;
  }

  validateExpiration(): this {
    if (DateHelper.isBeforeNow(this.#expiresAt)) {
      throw ErrorModel.forbidden({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }
    return this;
  }

  private validateRequiredString(value?: string | null): string {
    if (!value) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return value;
  }
}
