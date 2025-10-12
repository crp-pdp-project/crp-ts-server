import { UpdateResult } from 'kysely';
import { EmployeeSessionDM } from 'src/app/entities/dms/employeeSessions.dm';

import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateSessionExpireRepository {
  execute(
    jti: EmployeeSessionDM['jti'],
    expiresAt: EmployeeSessionDM['expiresAt'],
  ): Promise<UpdateResult>;
}

export class UpdateSessionExpireRepository implements IUpdateSessionExpireRepository {
  async execute(
    jti: EmployeeSessionDM['jti'],
    expiresAt: EmployeeSessionDM['expiresAt'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('EmployeeSessions')
      .set({ expiresAt })
      .where('jti', '=', jti)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateSessionExpireRepositoryMock implements IUpdateSessionExpireRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
