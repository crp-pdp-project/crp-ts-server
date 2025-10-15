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

  await db.schema.createIndex('UniqueEmployeeSessionJTI').on(tableName).column('jti').unique().execute();
  await db.schema.createIndex('UniqueEmployeeSessionUsername').on(tableName).column('jti').unique().execute();
  await db.schema.createIndex('IndexEmployeeSessionExpiresAt').on(tableName).column('expiresAt').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueEmployeeSessionJTI').on(tableName).execute();
  await db.schema.dropIndex('UniqueEmployeeSessionUsername').on(tableName).execute();
  await db.schema.dropIndex('IndexEmployeeSessionExpiresAt').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
