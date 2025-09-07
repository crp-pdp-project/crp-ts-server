import { Insertable, InsertResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ISavePatientAccountRepository {
  execute(patient: AccountDTO): Promise<InsertResult>;
}

export class SavePatientAccountRepository implements ISavePatientAccountRepository {
  async execute(account: AccountDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Accounts')
      .values(account as Insertable<AccountDM>)
      .executeTakeFirstOrThrow();
  }
}

export class SavePatientAccountRepositoryMock implements ISavePatientAccountRepository {
  async execute(): Promise<InsertResult> {
    return {
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    };
  }
}
