import { IncomingHttpHeaders } from 'http2';

import { EmployeeSessionPayloadDTO } from 'src/app/entities/dtos/service/employeeSessionPayload.dto';
import { EmployeeSessionModel } from 'src/app/entities/models/employeeSession/employeeSession.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import {
  GetEmployeeSessionRepository,
  IGetEmployeeSessionRepository,
} from 'src/app/repositories/database/getEmployeeSession.repository';
import {
  IUpdateEmployeeSessionExpireRepository,
  UpdateEmployeeSessionExpireRepository,
} from 'src/app/repositories/database/updateEmployeeSessionExpire.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import {
  EnrichedPayload,
  IJWTManager,
  JWTManagerBuilder,
  ValidationResponse,
} from 'src/general/managers/jwt/jwt.manager';

export interface IValidateEmployeeSessionInteractor {
  execute(headers: IncomingHttpHeaders): Promise<EmployeeSessionModel>;
}

export class ValidateEmployeeSessionInteractor implements IValidateEmployeeSessionInteractor {
  constructor(
    private readonly jwtManager: IJWTManager<EmployeeSessionPayloadDTO>,
    private readonly updateEmployeeSessionExpire: IUpdateEmployeeSessionExpireRepository,
    private readonly getEmployeeSession: IGetEmployeeSessionRepository,
  ) {}

  async execute(headers: IncomingHttpHeaders): Promise<EmployeeSessionModel> {
    const token = this.extractAndValidateToken(headers);
    const { payload, newExpireAt } = await this.decodeJWEToken(token);
    const sessionModel = await this.fetchSession(payload);
    await this.refreshSession(sessionModel, newExpireAt);

    return sessionModel;
  }

  private extractAndValidateToken(headers: IncomingHttpHeaders): string {
    const { authorization } = headers;

    if (!authorization?.startsWith('Bearer ')) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return authorization.slice(7);
  }

  private async decodeJWEToken(token: string): Promise<ValidationResponse<EmployeeSessionPayloadDTO>> {
    const result = await this.jwtManager.verifyToken(token);
    if (!result.payload || !result.payload?.jti) {
      throw ErrorModel.unauthorized({ detail: ClientErrorMessages.JWE_TOKEN_INVALID });
    }

    return result;
  }

  private async fetchSession(payload: EnrichedPayload<EmployeeSessionPayloadDTO>): Promise<EmployeeSessionModel> {
    const session = await this.getEmployeeSession.execute(payload.jti, payload.employee.username);
    const model = new EmployeeSessionModel(payload, session);
    model.validateExpiration();

    return model;
  }

  private async refreshSession(sessionModel: EmployeeSessionModel, newExpireAt: string): Promise<void> {
    await this.updateEmployeeSessionExpire.execute(sessionModel.jti, sessionModel.username, newExpireAt);
    sessionModel.refreshExiresAt(newExpireAt);
  }
}

export class ValidateEmployeeSessionInteractorBuilder {
  static build(): ValidateEmployeeSessionInteractor {
    return new ValidateEmployeeSessionInteractor(
      JWTManagerBuilder.buildEmployeeConfig(),
      new UpdateEmployeeSessionExpireRepository(),
      new GetEmployeeSessionRepository(),
    );
  }
}
