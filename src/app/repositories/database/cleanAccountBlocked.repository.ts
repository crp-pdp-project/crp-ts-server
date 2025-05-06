import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ICleanAccountBlockedRepository {
  execute(accountId: AccountDM['id']): Promise<UpdateResult>;
}

export class CleanAccountBlockedRepository implements ICleanAccountBlockedRepository {
  async execute(accountId: AccountDM['id']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Accounts')
      .set({ blockExpiredAt: null, tryCount: null })
      .where('id', '=', accountId)
      .executeTakeFirstOrThrow();
  }
}

export class CleanAccountBlockedRepositoryMock implements ICleanAccountBlockedRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
