import { Kysely, sql } from 'kysely';

const tableName = 'AuthAttempts';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('documentNumber', 'varchar(255)', (col) => col.notNull())
    .addColumn('flowIdentifier', 'varchar(255)', (col) => col.notNull())
    .addColumn('blockExpiredAt', 'datetime')
    .addColumn('tryCount', 'integer')
    .addColumn('tryCountExpiredAt', 'datetime')
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createIndex('UniqueAuthAttemptsPerFlow')
    .on(tableName)
    .columns(['documentNumber', 'flowIdentifier'])
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('UniqueAuthAttemptsPerFlow').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
