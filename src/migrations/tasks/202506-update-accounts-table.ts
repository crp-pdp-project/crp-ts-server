import { Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'Accounts';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable(tableName).dropColumn('biometricHash').dropColumn('biometricSalt').execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable(tableName)
    .addColumn('biometricHash', 'varchar(255)')
    .addColumn('biometricSalt', 'varchar(255)')
    .execute();
}
