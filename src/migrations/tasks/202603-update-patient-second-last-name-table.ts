import type { Kysely } from 'kysely';

import type { Database } from 'src/clients/mysql/mysql.client';

const tableName = 'Patients';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable(tableName).modifyColumn('secondLastName', 'varchar(255)').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable(tableName)
    .modifyColumn('secondLastName', 'varchar(255)', (col) => col.notNull())
    .execute();
}
