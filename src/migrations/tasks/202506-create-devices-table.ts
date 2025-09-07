import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'Devices';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('patientId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('os', 'varchar(255)', (col) => col.notNull())
    .addColumn('identifier', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('pushToken', 'varchar(512)')
    .addColumn('biometricHash', 'varchar(255)')
    .addColumn('biometricSalt', 'varchar(255)')
    .addColumn('expiresAt', 'datetime', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('IndexDeviceExpiresAt').on(tableName).column('expiresAt').execute();
  await db.schema
    .createIndex('UniqueDevicesByPatient')
    .on(tableName)
    .columns(['patientId', 'os', 'identifier'])
    .unique()
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('IndexDevicesExpiresAt').on(tableName).execute();
  await db.schema.dropIndex('UniqueDevicesByPatient').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
