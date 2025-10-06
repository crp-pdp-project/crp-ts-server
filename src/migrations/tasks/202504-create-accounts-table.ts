import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const tableName = 'Accounts';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('patientId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('passwordHash', 'varchar(255)', (col) => col.notNull())
    .addColumn('passwordSalt', 'varchar(255)', (col) => col.notNull())
    .addColumn('acceptTerms', 'boolean', (col) => col.notNull())
    .addColumn('acceptAdvertising', 'boolean', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueAccountPatientId').on(tableName).column('patientId').unique().execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueAccountPatientId').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
