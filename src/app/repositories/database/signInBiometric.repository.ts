import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { MysqlClient } from 'src/clients/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface ISignInBiometricRepository {
  execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
  ): Promise<AccountDTO | null>;
}

export class SignInBiometricRepository implements ISignInBiometricRepository {
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
        'Accounts.biometricHash',
        'Accounts.biometricSalt',
        'Accounts.tryCount',
        'Accounts.blockExpiredAt',
        SqlJSONHelper.jsonObject(
          [
            eb.ref('Patients.id'),
            eb.ref('Patients.firstName'),
            eb.ref('Patients.lastName'),
            eb.ref('Patients.secondLastName'),
            eb.ref('Patients.documentNumber'),
            eb.ref('Patients.documentType'),
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

export class SignInBiometricRepositoryMock implements ISignInBiometricRepository {
  async execute(): Promise<AccountDTO | null> {
    return {
      id: 1,
      biometricHash: 'anyHash',
      biometricSalt: 'anySalt',
      tryCount: 0,
      blockExpiredAt: '2027-05-05 12:24:23',
      patient: {
        id: 1,
        firstName: 'Renato',
        lastName: 'Berrocal',
        secondLastName: 'Vignolo',
        documentNumber: '88888888',
        documentType: 14,
      }
    };
  }
}
