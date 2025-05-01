import { UpdateResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IUpdateSessionOTPRepository {
  execute(jti: SessionDM['jti'], patientId: SessionDM['patientId'], otp: SessionDM['otp']): Promise<UpdateResult>;
}

export class UpdateSessionOTPRepository implements IUpdateSessionOTPRepository {
  async execute(
    jti: SessionDM['jti'],
    patientId: SessionDM['patientId'],
    otp: SessionDM['otp'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Sessions')
      .set({ otp })
      .where('jti', '=', jti)
      .where('patientId', '=', patientId)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateSessionOTPRepositoryMock implements IUpdateSessionOTPRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
