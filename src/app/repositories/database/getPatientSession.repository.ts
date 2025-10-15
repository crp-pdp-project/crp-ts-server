import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { SessionDM } from 'src/app/entities/dms/sessions.dm';
import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetPatientSessionRepository {
  execute(
    jti: SessionDM['jti'],
    os: DeviceDM['os'],
    identifier: DeviceDM['identifier'],
  ): Promise<SessionDTO | undefined>;
}

export class GetPatientSessionRepository implements IGetPatientSessionRepository {
  async execute(
    jti: SessionDM['jti'],
    os: DeviceDM['os'],
    identifier: DeviceDM['identifier'],
  ): Promise<SessionDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Sessions')
      .innerJoin('Devices', 'Devices.id', 'Sessions.deviceId')
      .select(['jti', 'Sessions.expiresAt', 'otp', 'otpSendCount', 'isValidated', 'deviceId'])
      .where('jti', '=', jti)
      .where('Devices.os', '=', os)
      .where('Devices.identifier', '=', identifier)
      .executeTakeFirst();
    return result;
  }
}

export class GetPatientSessionRepositoryMock implements IGetPatientSessionRepository {
  async execute(): Promise<SessionDTO | undefined> {
    return Promise.resolve({
      jti: '1c8302e7-6368-4c04-8923-4dadbccfe53e',
      expiresAt: '2025-04-24 02:58:01',
      otp: null,
      otpSendCount: null,
      isValidated: false,
    });
  }
}
