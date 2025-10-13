import { BaseModel } from 'src/app/entities/models/base.model';
import { GenerationResponse } from 'src/general/managers/jwt/jwt.manager';

import { EmployeeSessionDTO } from '../../dtos/service/employeeSession.dto';

import { EmployeeModel } from './employee.model';

export class EmployeeTokenModel extends BaseModel {
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

  toPersisSessionPayload(): EmployeeSessionDTO {
    return {
      jti: this.#jti,
      username: this.employee.username,
      expiresAt: this.#expiresAt,
    };
  }
}
