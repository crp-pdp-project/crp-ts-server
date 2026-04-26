import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { DateHelper } from 'src/general/helpers/date.helper';

export interface IGetPatientRelativeRepository {
  execute(id: PatientDM['id'], relativeId: PatientDM['id']): Promise<PatientDTO | undefined>;
}

export class GetPatientRelativeRepository implements IGetPatientRelativeRepository {
  async execute(id: PatientDM['id'], relativeId: PatientDM['id']): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .innerJoin('Families', 'Patients.id', 'Families.relativeId')
      .select([
        'Patients.id',
        'Patients.fmpId',
        'Patients.nhcId',
        'Patients.firstName',
        'Patients.lastName',
        'Patients.secondLastName',
        'Patients.birthDate',
        'Patients.documentNumber',
        'Patients.documentType',
      ])
      .where('Patients.id', '=', relativeId)
      .where('Families.principalId', '=', id)
      .executeTakeFirst();
    return result;
  }
}

export class GetPatientRelativeRepositoryMock implements IGetPatientRelativeRepository {
  async execute(): Promise<PatientDTO | undefined> {
    return Promise.resolve({
      id: 1,
      fmpId: '239254',
      nhcId: '00612719',
      firstName: 'Renato',
      lastName: 'Berrocal',
      secondLastName: 'Vignolo',
      documentNumber: '07583658',
      birthDate: DateHelper.toDate('dbDateTime'),
      documentType: 14,
    });
  }
}
