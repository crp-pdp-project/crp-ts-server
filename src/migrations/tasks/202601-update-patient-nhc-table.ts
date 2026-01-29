import { Kysely } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const tableName = 'Patients';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable(tableName).modifyColumn('nhcId', 'varchar(255)').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable(tableName)
    .modifyColumn('nhcId', 'varchar(255)', (col) => col.notNull())
    .execute();
}
