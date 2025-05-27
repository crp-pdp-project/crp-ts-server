import { UpdateResult } from 'kysely';

import { AuthAttemptsDM } from 'src/app/entities/dms/authAttempts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpdateBlockedRepository {
  execute(
    id: AuthAttemptsDM['id'],
    blockExpiredAt: AuthAttemptsDM['blockExpiredAt'],
  ): Promise<UpdateResult>;
}

export class UpdateBlockedRepository implements IUpdateBlockedRepository {
  async execute(
    id: AuthAttemptsDM['id'],
    blockExpiredAt: AuthAttemptsDM['blockExpiredAt'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('AuthAttempts')
      .set({ blockExpiredAt, tryCount: null })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateBlockedRepositoryMock implements IUpdateBlockedRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
