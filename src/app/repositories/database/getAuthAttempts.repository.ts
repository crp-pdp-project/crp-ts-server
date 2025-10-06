import { AuthAttemptDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptDTO } from 'src/app/entities/dtos/service/authAttempt.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetAuthAttemptsRepository {
  execute(
    documentNumber: AuthAttemptDM['documentNumber'],
    flowIdentifier: AuthAttemptDM['flowIdentifier'],
  ): Promise<AuthAttemptDTO | undefined>;
}

export class GetAuthAttemptsRepository implements IGetAuthAttemptsRepository {
  async execute(
    documentNumber: AuthAttemptDM['documentNumber'],
    flowIdentifier: AuthAttemptDM['flowIdentifier'],
  ): Promise<AuthAttemptDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('AuthAttempts')
      .select(['id', 'tryCount', 'blockExpiresAt', 'tryCountExpiresAt'])
      .where('documentNumber', '=', documentNumber)
      .where('flowIdentifier', '=', flowIdentifier)
      .executeTakeFirst();
    return result;
  }
}

export class GetAuthAttemptsRepositoryMock implements IGetAuthAttemptsRepository {
  async execute(): Promise<AuthAttemptDTO | undefined> {
    return {
      id: 1,
      tryCount: 1,
      blockExpiresAt: null,
      tryCountExpiresAt: null,
    };
  }
}
