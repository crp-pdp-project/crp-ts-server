import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { DateHelper } from 'src/general/helpers/date.helper';

export interface IGetPatientRepository {
  execute(id: PatientDM['id']): Promise<PatientDTO | undefined>;
}

export class GetPatientRepository implements IGetPatientRepository {
  async execute(id: PatientDM['id']): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .select([
        'id',
        'fmpId',
        'nhcId',
        'firstName',
        'lastName',
        'secondLastName',
        'birthDate',
        'documentNumber',
        'documentType',
      ])
      .where('id', '=', id)
      .executeTakeFirst();
    return result;
  }
}

export class GetPatientRepositoryMock implements IGetPatientRepository {
  async execute(): Promise<PatientDTO | undefined> {
    return Promise.resolve({
      id: 1,
      fmpId: '239254',
      nhcId: '00612719',
      firstName: 'Renato',
      lastName: 'Berrocal',
      secondLastName: 'Vignolo',
      birthDate: DateHelper.toDate('dbDateTime'),
      documentNumber: '07583658',
      documentType: 14,
    });
  }
}
