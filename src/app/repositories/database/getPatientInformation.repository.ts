import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IGetPatientInformationRepository {
  execute(fmpId: PatientDM['fmpId']): Promise<PatientDTO | undefined>;
}

export class GetPatientInformationRepository implements IGetPatientInformationRepository {
  async execute(fmpId: PatientDM['fmpId']): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .select(['id', 'documentNumber', 'documentType'])
      .where('fmpId', '=', fmpId)
      .executeTakeFirst();
    return result as PatientDTO | undefined;
  }
}

export class GetPatientInformationRepositoryMock implements IGetPatientInformationRepository {
  async execute(): Promise<PatientDTO | undefined> {
    return { id: 1, documentType: 14, documentNumber: '88888888' };
  }
}
