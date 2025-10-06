import { Insertable, InsertResult } from 'kysely';

import { FamilyDM } from 'src/app/entities/dms/families.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { RelationshipDM } from 'src/app/entities/dms/relationships.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface ISaveRelativeRepository {
  execute(
    principalId: PatientDM['id'],
    relativeId: PatientDM['id'],
    relationshipId: RelationshipDM['id'],
  ): Promise<InsertResult>;
}

export class SaveRelativeRepository implements ISaveRelativeRepository {
  async execute(
    principalId: PatientDM['id'],
    relativeId: PatientDM['id'],
    relationshipId: RelationshipDM['id'],
  ): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Families')
      .values({ principalId, relativeId, relationshipId } as Insertable<FamilyDM>)
      .executeTakeFirstOrThrow();
  }
}

export class SaveRelativeRepositoryMock implements ISaveRelativeRepository {
  async execute(): Promise<InsertResult> {
    return {
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    };
  }
}
