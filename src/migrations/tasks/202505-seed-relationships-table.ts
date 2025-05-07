import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';

export async function up(db: Kysely<Database>): Promise<void> {
  await db
    .insertInto('Relationships')
    .values([
      { id: 1, name: 'Hijo/a' },
      { id: 2, name: 'Hermano/a' },
      { id: 3, name: 'Esposo/a' },
      { id: 4, name: 'Abuelo/a' },
      { id: 5, name: 'Padre' },
      { id: 6, name: 'Madre' },
    ] as Insertable<Database['Relationships']>[])
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.deleteFrom('Relationships').where('id', 'in', [1, 2, 3, 4, 5, 6]).execute();
}
