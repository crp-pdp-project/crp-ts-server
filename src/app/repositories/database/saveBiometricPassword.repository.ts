import { UpdateResult } from 'kysely';

import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ISaveBiometricPasswordRepository {
  execute(id: DeviceDM['id'], device: DeviceDTO): Promise<UpdateResult>;
}

export class SaveBiometricPasswordRepository implements ISaveBiometricPasswordRepository {
  async execute(id: DeviceDM['id'], device: DeviceDTO): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Devices')
      .set({
        biometricHash: device.biometricHash,
        biometricSalt: device.biometricSalt,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class SaveBiometricPasswordRepositoryMock implements ISaveBiometricPasswordRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
