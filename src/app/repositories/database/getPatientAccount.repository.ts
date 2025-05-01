import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface IGetPatientAccountRepository {
  execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientDTO | null>;
}

export class GetPatientAccountRepository implements IGetPatientAccountRepository {
  async execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientDTO | null> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .leftJoin('Accounts', 'Accounts.patientId', 'Patients.id')
      .select((eb) => [
        'Patients.id',
        SqlJSONHelper.jsonObject([eb.ref('Accounts.id')], { checkNull: eb.ref('Accounts.id') }).as('account'),
      ])
      .where('Patients.documentType', '=', documentType)
      .where('Patients.documentNumber', '=', documentNumber)
      .executeTakeFirst();
    return result as PatientDTO;
  }
}

export class GetPatientAccountRepositoryMock implements IGetPatientAccountRepository {
  async execute(): Promise<PatientDTO | null> {
    return { id: 1, account: null };
  }
}
