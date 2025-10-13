import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const tableName = 'EmployeeSessions';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('username', 'varchar(255)', (col) => col.notNull())
    .addColumn('jti', 'varchar(255)', (col) => col.notNull())
    .addColumn('expiresAt', 'datetime', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueSessionJTI').on(tableName).column('jti').unique().execute();
  await db.schema.createIndex('UniqueSessionUsername').on(tableName).column('jti').unique().execute();
  await db.schema.createIndex('IndexSessionExpiresAt').on(tableName).column('expiresAt').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueSessionJTI').on(tableName).execute();
  await db.schema.dropIndex('UniqueSessionUsername').on(tableName).execute();
  await db.schema.dropIndex('IndexSessionExpiresAt').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
