import { DeleteResult } from 'kysely';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IDeleteRelativeRepository {
  execute(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<DeleteResult>;
}

export class DeleteRelativeRepository implements IDeleteRelativeRepository {
  async execute(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<DeleteResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .deleteFrom('Families')
      .where('principalId', '=', principalId)
      .where('relativeId', '=', relativeId)
      .executeTakeFirstOrThrow();
  }
}

export class DeleteRelativeRepositoryMock implements IDeleteRelativeRepository {
  async execute(): Promise<DeleteResult> {
    return Promise.resolve({ numDeletedRows: BigInt(1) });
  }
}
