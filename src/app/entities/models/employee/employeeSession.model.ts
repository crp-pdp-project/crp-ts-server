import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { GenerationResponse } from 'src/general/managers/jwt/jwt.manager';
import { EmployeeModel } from './employee.model';

export class EmployeeSessionModel extends BaseModel {
  readonly employee: EmployeeModel;
  readonly token: string;
  readonly #jti: string;
  readonly #expiresAt: string;

  constructor(employee: EmployeeModel, token: GenerationResponse) {
    super();

    this.employee = employee;
    this.token = token.jwt;
    this.#jti = token.jti;
    this.#expiresAt = token.expiresAt;
  }

  toPersisSessionPayload(): SessionDTO {
    return {
      jti: this.#jti,
      expiresAt: this.#expiresAt,
    };
  }
}
