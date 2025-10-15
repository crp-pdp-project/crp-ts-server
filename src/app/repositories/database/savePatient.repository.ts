import { Insertable, InsertResult } from 'kysely';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface ISavePatientRepository {
  execute(patient: PatientDTO): Promise<InsertResult>;
}

export class SavePatientRepository implements ISavePatientRepository {
  async execute(patient: PatientDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Patients')
      .values(patient as Insertable<PatientDM>)
      .executeTakeFirstOrThrow();
  }
}

export class SavePatientRepositoryMock implements ISavePatientRepository {
  async execute(): Promise<InsertResult> {
    return Promise.resolve({
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    });
  }
}
