import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface ISignInPatientRepository {
  execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientDTO | undefined>;
}

export class SignInPatientRepository implements ISignInPatientRepository {
  async execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .innerJoin('Accounts', 'Patients.id', 'Accounts.patientId')
      .select((eb) => [
        'Patients.id',
        'Patients.fmpId',
        'Patients.nhcId',
        'Patients.documentNumber',
        'Patients.documentType',
        'Patients.firstName',
        'Patients.lastName',
        'Patients.secondLastName',
        SqlJSONHelper.jsonObject(
          [eb.ref('Accounts.id'), eb.ref('Accounts.passwordHash'), eb.ref('Accounts.passwordSalt')],
          { checkNull: eb.ref('Accounts.id') },
        ).as('account'),
      ])
      .where('Patients.documentType', '=', documentType)
      .where('Patients.documentNumber', '=', documentNumber)
      .executeTakeFirst();
    return result as PatientDTO | undefined;
  }
}

export class SignInPatientRepositoryMock implements ISignInPatientRepository {
  async execute(): Promise<PatientDTO | undefined> {
    return {
      id: 1,
      fmpId: '239254',
      nhcId: '239254',
      documentNumber: '07583658',
      documentType: 14,
      firstName: 'Renato',
      lastName: 'Berrocal',
      account: {
        id: 1,
        passwordHash: '',
        passwordSalt: '',
      },
    };
  }
}
