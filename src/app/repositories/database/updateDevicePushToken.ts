import { UpdateResult } from 'kysely';

import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateDevicePushTokenRepository {
  execute(id: DeviceDM['id'], pushToken: DeviceDM['pushToken']): Promise<UpdateResult>;
}

export class UpdateDevicePushTokenRepository implements IUpdateDevicePushTokenRepository {
  async execute(id: DeviceDM['id'], pushToken: DeviceDM['pushToken']): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db.updateTable('Devices').set({ pushToken }).where('id', '=', id).executeTakeFirstOrThrow();
  }
}

export class UpdateDevicePushTokenRepositoryMock implements IUpdateDevicePushTokenRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
