import { DeleteResult } from 'kysely';

import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ICleanBlockedRepository {
  execute(documentNumber: AuthAttemptDM['documentNumber']): Promise<DeleteResult>;
}

export class CleanBlockedRepository implements ICleanBlockedRepository {
  async execute(documentNumber: AuthAttemptDM['documentNumber']): Promise<DeleteResult> {
    const db = MysqlClient.instance.getDb();
    return db.deleteFrom('AuthAttempts').where('documentNumber', '=', documentNumber).executeTakeFirstOrThrow();
  }
}

export class CleanBlockedRepositoryMock implements ICleanBlockedRepository {
  async execute(): Promise<DeleteResult> {
    return { numDeletedRows: BigInt(1) };
  }
}
