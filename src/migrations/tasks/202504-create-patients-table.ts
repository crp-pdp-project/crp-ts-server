import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'Patients';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('fmpId', 'varchar(255)', (col) => col.notNull())
    .addColumn('nhcId', 'varchar(255)')
    .addColumn('firstName', 'varchar(255)', (col) => col.notNull())
    .addColumn('lastName', 'varchar(255)', (col) => col.notNull())
    .addColumn('secondLastName', 'varchar(255)', (col) => col.notNull())
    .addColumn('birthDate', 'date', (col) => col.notNull())
    .addColumn('documentNumber', 'varchar(255)', (col) => col.notNull())
    .addColumn('documentType', 'integer', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniquePatientFmpId').on(tableName).column('fmpId').unique().execute();

  await db.schema.createIndex('UniquePatientNhcId').on(tableName).column('nhcId').unique().execute();

  await db.schema.createIndex('UniquePatientDocumentNumber').on(tableName).column('documentNumber').unique().execute();

  await db.schema.createIndex('IndexPatientDocumentType').on(tableName).column('documentType').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniquePatientFmpId').on(tableName).execute();
  await db.schema.dropIndex('UniquePatientNhcId').on(tableName).execute();
  await db.schema.dropIndex('UniquePatientDocumentNumber').on(tableName).execute();
  await db.schema.dropIndex('IndexPatientDocumentType').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
