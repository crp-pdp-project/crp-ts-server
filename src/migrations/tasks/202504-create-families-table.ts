import { Kysely, sql } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const tableName = 'Families';

export async function up(db: Kysely<Database>): Promise<void> {
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

  await db.schema.createIndex('IndexFamilyPrincipalId').on(tableName).column('principalId').execute();

  await db.schema.createIndex('IndexFamilyRelativeId').on(tableName).column('relativeId').execute();

  await db.schema.createIndex('IndexFamilyRelationshipId').on(tableName).column('relationshipId').execute();

  await db.schema
    .createIndex('UniqueFamilyPrincipalRelative')
    .on(tableName)
    .columns(['principalId', 'relativeId'])
    .unique()
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropIndex('UniqueFamilyPrincipalRelative').on(tableName).execute();
  await db.schema.dropIndex('IndexFamilyRelationshipId').on(tableName).execute();
  await db.schema.dropIndex('IndexFamilyRelativeId').on(tableName).execute();
  await db.schema.dropIndex('IndexFamilyPrincipalId').on(tableName).execute();
  await db.schema.dropTable(tableName).execute();
}
