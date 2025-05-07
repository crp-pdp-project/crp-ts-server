import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { MysqlClient } from 'src/clients/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface IGetPatientSessionRepository {
  execute(jti: string): Promise<SessionDTO | null>;
}

export class GetPatientSessionRepository implements IGetPatientSessionRepository {
  async execute(jti: string): Promise<SessionDTO | null> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Sessions')
      .innerJoin('Patients', 'Patients.id', 'Sessions.patientId')
      .leftJoin('Accounts', 'Accounts.patientId', 'Patients.id')
      .select((eb) => [
        'Sessions.id',
        'Sessions.jti',
        'Sessions.expiresAt',
        'Sessions.otp',
        'Sessions.isValidated',
        SqlJSONHelper.jsonObject(
          [
            eb.ref('Patients.id'),
            eb.ref('Patients.fmpId'),
            eb.ref('Patients.nhcId'),
            eb.ref('Patients.firstName'),
            eb.ref('Patients.lastName'),
            eb.ref('Patients.secondLastName'),
            eb.ref('Patients.documentType'),
            eb.ref('Patients.documentNumber'),
          ],
          { checkNull: eb.ref('Patients.id') },
        ).as('patient'),
        SqlJSONHelper.jsonObject([eb.ref('Accounts.id')], { checkNull: eb.ref('Accounts.id') }).as('account'),
      ])
      .where('Sessions.jti', '=', jti)
      .executeTakeFirst();
    return result as SessionDTO;
  }
}

export class GetPatientSessionRepositoryMock implements IGetPatientSessionRepository {
  async execute(): Promise<SessionDTO | null> {
    return {
      id: 1,
      jti: '1c8302e7-6368-4c04-8923-4dadbccfe53e',
      expiresAt: '2025-04-24 02:58:01',
      otp: null,
      isValidated: false,
      patient: {
        id: 1,
        fmpId: '239254',
        nhcId: '00733480',
        firstName: 'MARIA DEL PILAR LILIANA',
        lastName: 'ELESPURU',
        secondLastName: 'BRICENO DE BARRAZA',
        documentNumber: '63851747',
        documentType: 14,
      },
      account: {
        id: 1,
      },
    };
  }
}
