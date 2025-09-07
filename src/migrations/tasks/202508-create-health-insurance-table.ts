import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'HealthInsurances';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('paragraph', 'varchar(512)', (col) => col.notNull())
    .addColumn('subtitle', 'varchar(255)', (col) => col.notNull())
    .addColumn('bullets', 'json', (col) => col.notNull())
    .addColumn('banner', 'varchar(255)', (col) => col.notNull())
    .addColumn('pdfUrl', 'varchar(255)', (col) => col.notNull())
    .addColumn('enabled', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('IndexHealthInsurancesEnabled').on(tableName).column('enabled').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('IndexHealthInsuranceEnabled').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
