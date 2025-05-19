import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpdatePatientPasswordRepository {
  execute(id: AccountDM['id'], account: AccountDTO): Promise<UpdateResult>;
}

export class UpdatePatientPasswordRepository implements IUpdatePatientPasswordRepository {
  async execute(id: AccountDM['id'], account: AccountDTO): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Accounts')
      .set({
        passwordHash: account.passwordHash,
        passwordSalt: account.passwordSalt,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class UpdatePatientPasswordRepositoryMock implements IUpdatePatientPasswordRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
