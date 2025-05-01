import { Kysely, sql } from 'kysely';

const tableName: string = 'Accounts';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('patientId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('passwordHash', 'varchar(255)', (col) => col.notNull())
    .addColumn('passwordSalt', 'varchar(255)', (col) => col.notNull())
    .addColumn('biometricHash', 'varchar(255)')
    .addColumn('biometricSalt', 'varchar(255)')
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
