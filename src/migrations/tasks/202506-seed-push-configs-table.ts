import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';
import { PushDataTypes } from 'src/general/enums/pushDataTypes.enum';

const PUSH_CONFIGS_SEED = [
  {
    screen: 'test',
    config: JSON.stringify([
      { name: 'testId', type: PushDataTypes.STRING, isRequired: true },
      { name: 'testDescription', type: PushDataTypes.STRING, isRequired: false },
      { name: 'testFlag', type: PushDataTypes.BOOLEAN, isRequired: true },
      { name: 'testAmount', type: PushDataTypes.NUMBER, isRequired: false },
      { name: 'testCount', type: PushDataTypes.INTEGER, isRequired: true },
    ]),
  },
  {
    screen: 'appointment',
    config: JSON.stringify([{ name: 'appointmentId', type: PushDataTypes.STRING, isRequired: true }]),
  },
] as unknown as Insertable<Database['PushConfigs']>[];

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
