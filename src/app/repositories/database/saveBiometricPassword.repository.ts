import { UpdateResult } from 'kysely';

import { AccountDM } from 'src/app/entities/dms/accounts.dm';
import { AccountDTO } from 'src/app/entities/dtos/service/account.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface ISaveBiometricPasswordRepository {
  execute(id: AccountDM['id'], account: AccountDTO): Promise<UpdateResult>;
}

export class SaveBiometricPasswordRepository implements ISaveBiometricPasswordRepository {
  async execute(id: AccountDM['id'], account: AccountDTO): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('Accounts')
      .set({
        biometricHash: account.biometricHash,
        biometricSalt: account.biometricSalt,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}

export class SaveBiometricPasswordRepositoryMock implements ISaveBiometricPasswordRepository {
  async execute(): Promise<UpdateResult> {
    return { numUpdatedRows: BigInt(1) };
  }
}
