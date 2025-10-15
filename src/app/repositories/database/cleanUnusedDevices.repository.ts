import { DeleteResult, sql } from 'kysely';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface ICleanUnusedDevicesRepository {
  execute(patientId: PatientDM['id']): Promise<DeleteResult>;
}

export class CleanUnusedDevicesRepository implements ICleanUnusedDevicesRepository {
  async execute(patientId: PatientDM['id']): Promise<DeleteResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .deleteFrom('Devices')
      .where('patientId', '=', patientId)
      .where(sql<boolean>`expiresAt <= NOW()`)
      .where('biometricHash', 'is', null)
      .where('biometricSalt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}

export class CleanUnusedDevicesRepositoryMock implements ICleanUnusedDevicesRepository {
  async execute(): Promise<DeleteResult> {
    return Promise.resolve({ numDeletedRows: BigInt(1) });
  }
}
