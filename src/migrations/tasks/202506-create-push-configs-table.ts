import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'PushConfigs';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('screen', 'varchar(255)', (col) => col.notNull())
    .addColumn('config', 'json', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniquePushConfigScreen').on(tableName).column('screen').unique().execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniquePushConfigScreen').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
