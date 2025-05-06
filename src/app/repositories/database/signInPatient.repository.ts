import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { MysqlClient } from 'src/clients/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface ISignInPatientRepository {
  execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<AccountDTO | null>;
}

export class SignInPatientRepository implements ISignInPatientRepository {
  async execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<AccountDTO | null> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Accounts')
      .leftJoin('Patients', 'Patients.id', 'Accounts.patientId')
      .select((eb) => [
        'Accounts.id',
        'Accounts.passwordHash',
        'Accounts.passwordSalt',
        'Accounts.tryCount',
        'Accounts.blockExpiredAt',
        SqlJSONHelper.jsonObject(
          [
            eb.ref('Patients.id'),
            eb.ref('Patients.firstName'),
            eb.ref('Patients.lastName'),
            eb.ref('Patients.secondLastName'),
          ],
          { checkNull: eb.ref('Patients.id') },
        ).as('patient'),
      ])
      .where('Patients.documentType', '=', documentType)
      .where('Patients.documentNumber', '=', documentNumber)
      .executeTakeFirst();
    return result as AccountDTO;
  }
}

export class SignInPatientRepositoryMock implements ISignInPatientRepository {
  async execute(): Promise<AccountDTO | null> {
    return { id: 1, patient: { id: 1 } };
  }
}
