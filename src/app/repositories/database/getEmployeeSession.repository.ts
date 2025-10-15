import { EmployeeSessionDM } from 'src/app/entities/dms/employeeSessions.dm';
import { EmployeeSessionDTO } from 'src/app/entities/dtos/service/employeeSession.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetEmployeeSessionRepository {
  execute(
    jti: EmployeeSessionDM['jti'],
    username: EmployeeSessionDM['username'],
  ): Promise<EmployeeSessionDTO | undefined>;
}

export class GetEmployeeSessionRepository implements IGetEmployeeSessionRepository {
  async execute(
    jti: EmployeeSessionDM['jti'],
    username: EmployeeSessionDM['username'],
  ): Promise<EmployeeSessionDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('EmployeeSessions')
      .select(['jti', 'expiresAt', 'username'])
      .where('jti', '=', jti)
      .where('username', '=', username)
      .executeTakeFirst();
    return result;
  }
}

export class GetEmployeeSessionRepositoryMock implements IGetEmployeeSessionRepository {
  async execute(): Promise<EmployeeSessionDTO | undefined> {
    return Promise.resolve({
      jti: '1c8302e7-6368-4c04-8923-4dadbccfe53e',
      expiresAt: '2025-04-24 02:58:01',
      username: 'PRUEBA',
    });
  }
}
