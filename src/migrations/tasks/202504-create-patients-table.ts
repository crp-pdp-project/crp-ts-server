import { Kysely, sql } from 'kysely';

const tableName = 'Patients';

export async function up(db: Kysely<unknown>): Promise<void> {
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
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueFmpId').on(tableName).column('fmpId').unique().execute();

  await db.schema.createIndex('UniqueNhcId').on(tableName).column('nhcId').unique().execute();

  await db.schema.createIndex('UniqueDocumentNumber').on(tableName).column('documentNumber').unique().execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('uniqueUsersFmpId').execute();
  await db.schema.dropIndex('uniqueUsersNhcId').execute();
  await db.schema.dropIndex('uniqueUsersDocumentNumber').execute();
  await db.schema.dropTable(tableName).execute();
}
