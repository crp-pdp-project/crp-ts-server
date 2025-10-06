import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const RELATIONSHIP_SEED = [
  { name: 'Hijo/a menor de edad', isDependant: true },
  { name: 'Padre/Madre mayor de edad', isDependant: true },
  { name: 'Familiar dependiente (CONADIS)', isDependant: true },
  { name: 'Conyuge', isDependant: false },
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
