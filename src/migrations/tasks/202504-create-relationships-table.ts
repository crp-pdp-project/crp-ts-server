import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const tableName = 'Relationships';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('isDependant', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueRelationshipName').on(tableName).column('name').unique().execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueRelationshipName').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
