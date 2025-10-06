import { Insertable, InsertResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpsertSessionRepository {
  execute(session: SessionDTO): Promise<InsertResult>;
}

export class UpsertSessionRepository implements IUpsertSessionRepository {
  async execute(session: SessionDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Sessions')
      .values(session as Insertable<SessionDM>)
      .onDuplicateKeyUpdate((eb) => ({
        jti: eb.val(session.jti),
        expiresAt: eb.val(session.expiresAt),
        deviceId: eb.val(session.deviceId),
        otp: eb.val(session.otp ?? null),
        otpSendCount: eb.val(session.otpSendCount ?? null),
        isValidated: eb.val(session.isValidated ?? false),
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpsertSessionRepositoryMock implements IUpsertSessionRepository {
  async execute(): Promise<InsertResult> {
    return {
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    };
  }
}
