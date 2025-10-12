import { UpdateResult } from 'kysely';

import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IValidateSessionOTPRepository {
  execute(jti: SessionDM['jti'], patientId: SessionDM['patientId']): Promise<UpdateResult>;
}

export class ValidateSessionOTPRepository implements IValidateSessionOTPRepository {
  async execute(jti: SessionDM['jti'], patientId: SessionDM['patientId']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Sessions')
      .set({ isValidated: true })
      .where('jti', '=', jti)
      .where('patientId', '=', patientId)
      .executeTakeFirstOrThrow();
  }
}

export class ValidateSessionOTPRepositoryMock implements IValidateSessionOTPRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
