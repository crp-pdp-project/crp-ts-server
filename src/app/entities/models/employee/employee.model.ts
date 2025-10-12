import { BaseModel } from 'src/app/entities/models/base.model';
import { EmployeeDTO } from '../../dtos/service/employee.dto';

export class EmployeeModel extends BaseModel {
  readonly username?: string | null;
  readonly name?: string | null;

  constructor(employee: EmployeeDTO) {
    super();

    this.username = employee.username ?? null;
    this.name = employee.name ?? null;
  }
}
