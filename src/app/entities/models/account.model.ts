import { BaseModel } from 'src/app/entities/models/base.model';

import { AccountDTO } from '../dtos/service/account.dto';

export class AccountModel extends BaseModel {
  readonly id?: number;
  readonly patientId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;

  constructor(account: AccountDTO) {
    super();

    this.id = account.id;
    this.patientId = account.patientId;
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
  }
}
