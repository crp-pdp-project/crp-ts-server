import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { DeviceDTO } from 'src/app/entities/dtos/service/device.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetDeviceTokensRepository {
  execute(documentType: PatientDM['documentType'], documentNumber: PatientDM['documentNumber']): Promise<DeviceDTO[]>;
}

export class GetDeviceTokensRepository implements IGetDeviceTokensRepository {
  async execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<DeviceDTO[]> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Devices')
      .innerJoin('Patients', 'Devices.patientId', 'Patients.id')
      .select(['pushToken'])
      .where('Patients.documentType', '=', documentType)
      .where('Patients.documentNumber', '=', documentNumber)
      .execute();
    return result as DeviceDTO[];
  }
}

export class GetDeviceTokensRepositoryMock implements IGetDeviceTokensRepository {
  async execute(): Promise<DeviceDTO[]> {
    return Promise.resolve([
      {
        pushToken: 'AnyToken',
      },
    ]);
  }
}
