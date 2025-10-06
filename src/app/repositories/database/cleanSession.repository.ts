import { DeleteResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface ICleanSessionRepository {
  execute(jti: SessionDM['jti'], patientId: SessionDM['patientId']): Promise<DeleteResult>;
}

export class CleanSessionRepository implements ICleanSessionRepository {
  async execute(jti: SessionDM['jti'], patientId: SessionDM['patientId']): Promise<DeleteResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .deleteFrom('Sessions')
      .where('jti', '=', jti)
      .where('patientId', '=', patientId)
      .executeTakeFirstOrThrow();
  }
}

export class CleanSessionRepositoryMock implements ICleanSessionRepository {
  async execute(): Promise<DeleteResult> {
    return { numDeletedRows: BigInt(1) };
  }
}
