import { UpdateResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateSessionExpireRepository {
  execute(
    jti: SessionDM['jti'],
    patientId: SessionDM['patientId'],
    expiresAt: SessionDM['expiresAt'],
  ): Promise<UpdateResult>;
}

export class UpdateSessionExpireRepository implements IUpdateSessionExpireRepository {
  async execute(
    jti: SessionDM['jti'],
    patientId: SessionDM['patientId'],
    expiresAt: SessionDM['expiresAt'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Sessions')
      .set({ expiresAt })
      .where('jti', '=', jti)
      .where('patientId', '=', patientId)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateSessionExpireRepositoryMock implements IUpdateSessionExpireRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
