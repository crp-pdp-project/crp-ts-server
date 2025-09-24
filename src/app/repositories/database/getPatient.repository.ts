import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IGetPatientRepository {
  execute(id: PatientDM['id']): Promise<PatientDTO | undefined>;
}

export class GetPatientRepository implements IGetPatientRepository {
  async execute(id: PatientDM['id']): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .select(['id', 'documentNumber', 'documentType'])
      .where('id', '=', id)
      .executeTakeFirst();
    return result as PatientDTO | undefined;
  }
}

export class GetPatientRepositoryMock implements IGetPatientRepository {
  async execute(): Promise<PatientDTO | undefined> {
    return { id: 1 };
  }
}
