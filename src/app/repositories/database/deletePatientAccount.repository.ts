import { DeleteResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IDeletePatientAccountRepository {
  execute(id: AccountDM['id']): Promise<DeleteResult>;
}

export class DeletePatientAccountRepository implements IDeletePatientAccountRepository {
  async execute(id: AccountDM['id']): Promise<DeleteResult> {
    const db = MysqlClient.instance.getDb();
    return db.deleteFrom('Accounts').where('id', '=', id).executeTakeFirstOrThrow();
  }
}

export class DeletePatientAccountRepositoryMock implements IDeletePatientAccountRepository {
  async execute(): Promise<DeleteResult> {
    return Promise.resolve({ numDeletedRows: BigInt(1) });
  }
}
