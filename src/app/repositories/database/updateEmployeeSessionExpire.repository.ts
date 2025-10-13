import { UpdateResult } from 'kysely';

import { EmployeeSessionDM } from 'src/app/entities/dms/employeeSessions.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateEmployeeSessionExpireRepository {
  execute(
    jti: EmployeeSessionDM['jti'],
    username: EmployeeSessionDM['username'],
    expiresAt: EmployeeSessionDM['expiresAt'],
  ): Promise<UpdateResult>;
}

export class UpdateEmployeeSessionExpireRepository implements IUpdateEmployeeSessionExpireRepository {
  async execute(
    jti: EmployeeSessionDM['jti'],
    username: EmployeeSessionDM['username'],
    expiresAt: EmployeeSessionDM['expiresAt'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('EmployeeSessions')
      .set({ expiresAt })
      .where('jti', '=', jti)
      .where('username', '=', username)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateEmployeeSessionExpireRepositoryMock implements IUpdateEmployeeSessionExpireRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
