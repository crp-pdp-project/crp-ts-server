import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const RELATIONSHIP_SEED = [
  { name: 'Hijo/a' },
  { name: 'Hermano/a' },
  { name: 'Esposo/a' },
  { name: 'Abuelo/a' },
  { name: 'Padre' },
  { name: 'Madre' },
] as Insertable<Database['Relationships']>[];

export async function up(db: Kysely<Database>): Promise<void> {
  await db.insertInto('Relationships').values(RELATIONSHIP_SEED).execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db
    .deleteFrom('Relationships')
    .where(
      'name',
      'in',
      RELATIONSHIP_SEED.map((r) => r.name),
    )
    .execute();
}
