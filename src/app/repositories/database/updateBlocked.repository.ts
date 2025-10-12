import { UpdateResult } from 'kysely';

import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateBlockedRepository {
  execute(id: AuthAttemptDM['id'], blockExpiresAt: AuthAttemptDM['blockExpiresAt']): Promise<UpdateResult>;
}

export class UpdateBlockedRepository implements IUpdateBlockedRepository {
  async execute(id: AuthAttemptDM['id'], blockExpiresAt: AuthAttemptDM['blockExpiresAt']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('AuthAttempts')
      .set({ blockExpiresAt, tryCount: null, tryCountExpiresAt: null })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateBlockedRepositoryMock implements IUpdateBlockedRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
