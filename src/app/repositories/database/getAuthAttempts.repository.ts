import { AuthAttemptsDM } from 'src/app/entities/dms/authAttempts.dm';
import { AuthAttemptsDTO } from 'src/app/entities/dtos/service/authAttempts.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IGetAuthAttemptsRepository {
  execute(
    documentNumber: AuthAttemptsDM['documentNumber'],
    flowIdentifier: AuthAttemptsDM['flowIdentifier'],
  ): Promise<AuthAttemptsDTO | undefined>;
}

export class GetAuthAttemptsRepository implements IGetAuthAttemptsRepository {
  async execute(
    documentNumber: AuthAttemptsDM['documentNumber'],
    flowIdentifier: AuthAttemptsDM['flowIdentifier'],
  ): Promise<AuthAttemptsDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('AuthAttempts')
      .select(['id', 'tryCount', 'blockExpiredAt', 'tryCountExpiredAt'])
      .where('documentNumber', '=', documentNumber)
      .where('flowIdentifier', '=', flowIdentifier)
      .executeTakeFirst();
    return result;
  }
}

export class GetAuthAttemptsRepositoryMock implements IGetAuthAttemptsRepository {
  async execute(): Promise<AuthAttemptsDTO | undefined> {
    return {
      id: 1,
      tryCount: 1,
      blockExpiredAt: null,
      tryCountExpiredAt: null,
    };
  }
}
