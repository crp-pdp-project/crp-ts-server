import { Kysely, sql } from 'kysely';

const tableName: string = 'Families';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
    .addColumn('principalId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('relativeId', 'bigint', (col) => col.notNull().references('Patients.id').onDelete('cascade'))
    .addColumn('relationshipId', 'bigint', (col) => col.notNull().references('Relationships.id').onDelete('restrict'))
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
