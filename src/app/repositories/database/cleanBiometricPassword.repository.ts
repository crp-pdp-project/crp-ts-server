import { UpdateResult } from 'kysely';

import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface ICleanBiometricPasswordRepository {
  execute(id: DeviceDM['id']): Promise<UpdateResult>;
}

export class CleanBiometricPasswordRepository implements ICleanBiometricPasswordRepository {
  async execute(id: DeviceDM['id']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Devices')
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
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
