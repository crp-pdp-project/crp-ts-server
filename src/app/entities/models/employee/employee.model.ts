import { BaseModel } from 'src/app/entities/models/base.model';

import { EmployeeDTO } from '../../dtos/service/employee.dto';
import { EmployeeSessionPayloadDTO } from '../../dtos/service/employeeSessionPayload.dto';

export class EmployeeModel extends BaseModel {
  readonly username: string;
  readonly internalUsername: string | null;
  readonly name: string | null;

  constructor(employee: EmployeeDTO) {
    super();

    this.username = employee.username;
    this.internalUsername = employee.internalUsername ?? null;
    this.name = employee.name ?? null;
  }

  toSessionPayload(): EmployeeSessionPayloadDTO {
    return {
      employee: {
        username: this.username,
        internalUsername: this.internalUsername,
        name: this.name,
      },
    };
  }
}
