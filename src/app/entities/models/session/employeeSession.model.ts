import { Audiences } from 'src/general/enums/audience.enum';

import { EmployeeSessionDTO } from '../../dtos/service/employeeSession.dto';
import { EmployeeSessionPayloadDTO } from '../../dtos/service/employeeSessionPayload.dto';

import { SessionModel } from './session.model';

export class EmployeeSignInSessionModel extends SessionModel {
  readonly type = Audiences.EMPLOYEE_SIGN_IN;
  readonly username: EmployeeSessionDTO['username'];
  readonly employee: EmployeeSessionPayloadDTO['employee'];

  constructor(session: EmployeeSessionDTO, payload: EmployeeSessionPayloadDTO) {
    super(session.jti, session.expiresAt);

    this.employee = payload.employee;
  }
}
