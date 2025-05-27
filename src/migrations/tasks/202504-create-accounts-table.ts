import { Kysely, sql } from 'kysely';

const tableName = 'Accounts';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('patientId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('passwordHash', 'varchar(255)', (col) => col.notNull())
    .addColumn('passwordSalt', 'varchar(255)', (col) => col.notNull())
    .addColumn('biometricHash', 'varchar(255)')
    .addColumn('biometricSalt', 'varchar(255)')
    .addColumn('acceptTerms', 'boolean', (col) => col.notNull())
    .addColumn('acceptAdvertising', 'boolean', (col) => col.notNull())
    .addColumn('blockExpiredAt', 'datetime')
    .addColumn('tryCount', 'integer')
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueAccountPatientId').on(tableName).column('patientId').unique().execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('UniqueAccountPatientId').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
