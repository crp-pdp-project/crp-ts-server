import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpdateAccountTryCountRepository {
  execute(accountId: AccountDM['id'], tryCount: AccountDM['tryCount']): Promise<UpdateResult>;
}

export class UpdateAccountTryCountRepository implements IUpdateAccountTryCountRepository {
  async execute(accountId: AccountDM['id'], tryCount: AccountDM['tryCount']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db.updateTable('Accounts').set({ tryCount }).where('id', '=', accountId).executeTakeFirstOrThrow();
  }
}

export class UpdateAccountTryCountRepositoryMock implements IUpdateAccountTryCountRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
