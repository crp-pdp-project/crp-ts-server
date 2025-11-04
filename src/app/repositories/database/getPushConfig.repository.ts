import { PushConfigDM } from 'src/app/entities/dms/pushConfigs.dm';
import { PushConfigDTO } from 'src/app/entities/dtos/service/pushConfig.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { PushDataTypes } from 'src/general/enums/pushDataTypes.enum';

export interface IGetPushConfigRepository {
  execute(screen: PushConfigDM['screen']): Promise<PushConfigDTO | undefined>;
}

export class GetPushConfigRepository implements IGetPushConfigRepository {
  async execute(screen: PushConfigDM['screen']): Promise<PushConfigDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('PushConfigs')
      .select(['config'])
      .where('screen', '=', screen)
      .executeTakeFirst();
    return result as PushConfigDTO | undefined;
  }
}

export class GetPushConfigRepositoryMock implements IGetPushConfigRepository {
  async execute(): Promise<PushConfigDTO | undefined> {
    return Promise.resolve({
      config: [
        {
          name: 'test',
          type: PushDataTypes.STRING,
          isRequired: true,
        },
      ],
    });
  }
}
