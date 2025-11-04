import { UpdateResult } from 'kysely';

import { FamilyDM } from 'src/app/entities/dms/families.dm';
import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateRelativeVerificationRepository {
  execute(
    principalId: PatientDM['id'],
    relativeId: PatientDM['id'],
    isVerified: FamilyDM['isVerified'],
  ): Promise<UpdateResult>;
}

export class UpdateRelativeVerificationRepository implements IUpdateRelativeVerificationRepository {
  async execute(
    principalId: PatientDM['id'],
    relativeId: PatientDM['id'],
    isVerified: FamilyDM['isVerified'],
  ): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Families')
      .set({ isVerified })
      .where('principalId', '=', principalId)
      .where('relativeId', '=', relativeId)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateRelativeVerificationRepositoryMock implements IUpdateRelativeVerificationRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
