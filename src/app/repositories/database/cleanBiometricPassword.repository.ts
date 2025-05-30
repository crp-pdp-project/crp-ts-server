import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ICleanBiometricPasswordRepository {
  execute(id: AccountDM['id']): Promise<UpdateResult>;
}

export class CleanBiometricPasswordRepository implements ICleanBiometricPasswordRepository {
  async execute(id: AccountDM['id']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Accounts')
      .set({
        biometricHash: null,
        biometricSalt: null,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class CleanBiometricPasswordRepositoryMock implements ICleanBiometricPasswordRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
