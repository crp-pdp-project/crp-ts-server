import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';
import { PushDataTypes } from 'src/general/enums/pushDataTypes.enum';

const PUSH_CONFIGS_SEED = [
  {
    screen: 'test',
    config: [
      { name: 'testId', type: PushDataTypes.STRING },
      { name: 'testDescription', type: PushDataTypes.STRING },
      { name: 'testFlag', type: PushDataTypes.BOOLEAN },
      { name: 'testAmount', type: PushDataTypes.NUMBER },
      { name: 'testCount', type: PushDataTypes.INTEGER },
    ],
  },
  {
    screen: 'appointment',
    config: [{ name: 'appointmentId', type: PushDataTypes.STRING }],
  },
] as Insertable<Database['PushConfigs']>[];

export async function up(db: Kysely<Database>): Promise<void> {
  await db.insertInto('PushConfigs').values(PUSH_CONFIGS_SEED).execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db
    .deleteFrom('PushConfigs')
    .where(
      'screen',
      'in',
      PUSH_CONFIGS_SEED.map((r) => r.screen),
    )
    .execute();
}
