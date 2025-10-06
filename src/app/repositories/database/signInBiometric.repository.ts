import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface ISignInBiometricRepository {
  execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
    identifier: DeviceDM['identifier'],
    os: DeviceDM['os'],
  ): Promise<PatientDTO | undefined>;
}

export class SignInBiometricRepository implements ISignInBiometricRepository {
  async execute(
    documentType: PatientDM['documentType'],
    documentNumber: PatientDM['documentNumber'],
    identifier: DeviceDM['identifier'],
    os: DeviceDM['os'],
  ): Promise<PatientDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients')
      .innerJoin('Accounts', 'Patients.id', 'Accounts.patientId')
      .innerJoin('Devices', 'Patients.id', 'Devices.patientId')
      .select((eb) => [
        'Patients.id',
        'Patients.fmpId',
        'Patients.nhcId',
        'Patients.documentNumber',
        'Patients.documentType',
        'Patients.firstName',
        'Patients.lastName',
        'Patients.secondLastName',
        'Patients.createdAt',
        SqlJSONHelper.jsonObject([eb.ref('Accounts.id')], { checkNull: eb.ref('Accounts.id') }).as('account'),
        SqlJSONHelper.jsonObject(
          [eb.ref('Devices.id'), eb.ref('Devices.biometricHash'), eb.ref('Devices.biometricSalt')],
          { checkNull: eb.ref('Devices.id') },
        ).as('device'),
      ])
      .where('Patients.documentType', '=', documentType)
      .where('Patients.documentNumber', '=', documentNumber)
      .where('Devices.identifier', '=', identifier)
      .where('Devices.os', '=', os)
      .executeTakeFirst();
    return result as PatientDTO | undefined;
  }
}

export class SignInBiometricRepositoryMock implements ISignInBiometricRepository {
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
      },
      device: {
        id: 1,
        biometricHash: '',
        biometricSalt: '',
      },
    };
  }
}
