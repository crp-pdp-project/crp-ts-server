import { Insertable, InsertResult, sql } from 'kysely';

import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpsertDeviceRepository {
  execute(device: DeviceDTO): Promise<InsertResult>;
}

export class UpsertDeviceRepository implements IUpsertDeviceRepository {
  async execute(device: DeviceDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Devices')
      .values(device as Insertable<DeviceDM>)
      .onDuplicateKeyUpdate((eb) => ({
        expiresAt: eb.val(device.expiresAt),
        pushToken:
          device.pushToken != null
            ? sql`IF(Devices.pushToken IS NULL, ${device.pushToken}, Devices.pushToken)`
            : sql`Devices.pushToken`,
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpsertDeviceRepositoryMock implements IUpsertDeviceRepository {
  async execute(): Promise<InsertResult> {
    return Promise.resolve({
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    });
  }
}
