import { Insertable, InsertResult } from 'kysely';
import { EmployeeSessionDM } from 'src/app/entities/dms/employeeSessions.dm';

import { EmployeeSessionDTO } from 'src/app/entities/dtos/service/employeeSession.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpsertEmployeeSessionRepository {
  execute(session: EmployeeSessionDTO): Promise<InsertResult>;
}

export class UpsertEmployeeSessionRepository implements IUpsertEmployeeSessionRepository {
  async execute(session: EmployeeSessionDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('EmployeeSessions')
      .values(session as Insertable<EmployeeSessionDM>)
      .onDuplicateKeyUpdate((eb) => ({
        jti: eb.val(session.jti),
        username: eb.val(session.username),
        expiresAt: eb.val(session.expiresAt),
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpsertEmployeeSessionRepositoryMock implements IUpsertEmployeeSessionRepository {
  async execute(): Promise<InsertResult> {
    return Promise.resolve({
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    });
  }
}
