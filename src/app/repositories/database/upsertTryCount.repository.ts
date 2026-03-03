import type { Insertable, InsertResult } from 'kysely';

import type { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import type { AuthAttemptDTO } from 'src/app/entities/dtos/service/authAttempt.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpsertTryCountRepository {
  execute(attempt: AuthAttemptDTO): Promise<InsertResult>;
}

export class UpsertTryCountRepository implements IUpsertTryCountRepository {
  async execute(attempt: AuthAttemptDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('AuthAttempts')
      .values(attempt as Insertable<AuthAttemptDM>)
      .onDuplicateKeyUpdate((eb) => ({
        id: eb.fn('LAST_INSERT_ID', [eb.ref('id')]),
        tryCount: eb.val(attempt.tryCount),
        tryCountExpiresAt: eb.val(attempt.tryCountExpiresAt),
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpdateAccountTryCountRepositoryMock implements IUpsertTryCountRepository {
  async execute(): Promise<InsertResult> {
    return Promise.resolve({
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    });
  }
}
