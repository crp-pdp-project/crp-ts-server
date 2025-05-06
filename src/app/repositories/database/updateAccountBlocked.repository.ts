import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpdateAccountBlockedRepository {
  execute(accountId: AccountDM['id'], blockExpiredAt: AccountDM['blockExpiredAt']): Promise<UpdateResult>;
}

export class UpdateAccountBlockedRepository implements IUpdateAccountBlockedRepository {
  async execute(accountId: AccountDM['id'], blockExpiredAt: AccountDM['blockExpiredAt']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Accounts')
      .set({ blockExpiredAt, tryCount: null })
      .where('id', '=', accountId)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateAccountBlockedRepositoryMock implements IUpdateAccountBlockedRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
