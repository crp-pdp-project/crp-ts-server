import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { BaseModel } from 'src/app/entities/models/base.model';

export class AccountModel extends BaseModel {
  readonly id?: number;
  readonly patientId?: number;
  readonly password?: string;
  readonly passwordHash?: string;
  readonly passwordSalt?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;

  constructor(account: AccountDTO) {
    super();

    this.id = account.id;
    this.patientId = account.patientId;
    this.password = account.password;
    this.passwordHash = account.passwordHash;
    this.passwordSalt = account.passwordSalt;
    this.createdAt = account.createdAt;
    this.updatedAt = account.updatedAt;
  }
}
