import { SessionDTO } from 'src/app/entities/dtos/service/session.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IGetPatientSessionRepository {
  execute(jti: string): Promise<SessionDTO | null>;
}

export class GetPatientSessionRepository implements IGetPatientSessionRepository {
  async execute(jti: string): Promise<SessionDTO | null> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Sessions')
      .select(['Sessions.jti', 'Sessions.expiresAt', 'Sessions.otp', 'Sessions.isValidated'])
      .where('Sessions.jti', '=', jti)
      .executeTakeFirst();
    return result as SessionDTO;
  }
}

export class GetPatientSessionRepositoryMock implements IGetPatientSessionRepository {
  async execute(): Promise<SessionDTO | null> {
    return {
      jti: '1c8302e7-6368-4c04-8923-4dadbccfe53e',
      expiresAt: '2025-04-24 02:58:01',
      otp: null,
      isValidated: false,
    };
  }
}
