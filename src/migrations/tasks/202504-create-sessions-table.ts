import { Kysely, sql } from 'kysely';

const tableName = 'Sessions';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('patientId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('jti', 'varchar(255)', (col) => col.notNull())
    .addColumn('otp', 'varchar(5)')
    .addColumn('otpSendCount', 'integer')
    .addColumn('isValidated', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('expiresAt', 'datetime', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('uniqueSessionJTI').on(tableName).column('jti').unique().execute();

  await db.schema.createIndex('uniqueSessionPatientId').on(tableName).column('patientId').unique().execute();

  await db.schema.createIndex('indexSessionExpiresAt').on(tableName).column('expiresAt').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('uniqueSessionJTI').on(tableName).execute();
  await db.schema.dropIndex('uniqueSessionPatientId').on(tableName).execute();
  await db.schema.dropIndex('indexSessionExpiresAt').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
