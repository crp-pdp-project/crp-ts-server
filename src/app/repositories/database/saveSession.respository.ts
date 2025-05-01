import { Insertable, InsertResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ISaveSessionRepository {
  execute(session: SessionDTO): Promise<InsertResult>;
}

export class SaveSessionRepository implements ISaveSessionRepository {
  async execute(session: SessionDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Sessions')
      .values(session as Insertable<SessionDM>)
      .onDuplicateKeyUpdate({
        jti: session.jti,
        expiresAt: session.expiresAt,
        otp: session.otp ?? null,
        isValidated: session.isValidated ?? false,
      })
      .executeTakeFirstOrThrow();
  }
}

export class SaveSessionRepositoryMock implements ISaveSessionRepository {
  async execute(): Promise<InsertResult> {
    return {
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    };
  }
}
