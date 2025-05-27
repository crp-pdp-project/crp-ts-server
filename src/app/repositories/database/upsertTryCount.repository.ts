import { Insertable, InsertResult } from 'kysely';

import { AuthAttemptsDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpsertTryCountRepository {
  execute(attempt: AuthAttemptsDTO): Promise<InsertResult>;
}

export class UpsertTryCountRepository implements IUpsertTryCountRepository {
  async execute(attempt: AuthAttemptsDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('AuthAttempts')
      .values(attempt as Insertable<AuthAttemptsDM>)
      .onDuplicateKeyUpdate((eb) => ({
        tryCount: eb.val(attempt.tryCount),
        tryCountExpiredAt: eb.val(attempt.tryCountExpiredAt),
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpdateAccountTryCountRepositoryMock implements IUpsertTryCountRepository {
  async execute(): Promise<InsertResult> {
    return {
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    };
  }
}
