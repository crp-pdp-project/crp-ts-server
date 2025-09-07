import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'AuthAttempts';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('documentNumber', 'varchar(255)', (col) => col.notNull())
    .addColumn('flowIdentifier', 'varchar(255)', (col) => col.notNull())
    .addColumn('blockExpiresAt', 'datetime')
    .addColumn('tryCount', 'integer')
    .addColumn('tryCountExpiresAt', 'datetime')
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createIndex('UniqueAuthAttemptsPerFlow')
    .on(tableName)
    .columns(['documentNumber', 'flowIdentifier'])
    .unique()
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueAuthAttemptsPerFlow').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
