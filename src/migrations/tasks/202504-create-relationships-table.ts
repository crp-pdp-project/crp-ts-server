import { Kysely, sql } from 'kysely';

const tableName = 'Relationships';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updatedAt', 'datetime', (col) =>
      col
        .notNull()
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createIndex('UniqueRelationshipName').on(tableName).column('name').unique().execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('UniqueRelationshipName').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
