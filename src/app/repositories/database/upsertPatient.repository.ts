import type { Insertable, InsertResult } from 'kysely';

import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpsertPatientRepository {
  execute(patient: PatientDTO): Promise<InsertResult>;
}

export class UpsertPatientRepository implements IUpsertPatientRepository {
  async execute(patient: PatientDTO): Promise<InsertResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .insertInto('Patients')
      .values(patient as Insertable<PatientDM>)
      .onDuplicateKeyUpdate((eb) => ({
        id: eb.fn('LAST_INSERT_ID', [eb.ref('id')]),
        nhcId: eb.val(patient.nhcId),
        firstName: eb.val(patient.firstName),
        lastName: eb.val(patient.lastName),
        secondLastName: eb.val(patient.secondLastName),
        documentType: eb.val(patient.documentType),
        birthDate: eb.val(patient.birthDate),
      }))
      .executeTakeFirstOrThrow();
  }
}

export class UpsertPatientRepositoryMock implements IUpsertPatientRepository {
  async execute(): Promise<InsertResult> {
    return Promise.resolve({
      insertId: BigInt(1),
      numInsertedOrUpdatedRows: BigInt(1),
    });
  }
}
