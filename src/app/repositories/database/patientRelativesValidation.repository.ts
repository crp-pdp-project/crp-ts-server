import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql.client';

export interface IPatientRelativesValidationRepository {
  execute(id: PatientDM['id']): Promise<PatientDTO[]>;
}

export class PatientRelativesValidationRepository implements IPatientRelativesValidationRepository {
  async execute(id: PatientDM['id']): Promise<PatientDTO[]> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Families')
      .innerJoin('Patients as Relatives', 'Families.relativeId', 'Relatives.id')
      .select(['Relatives.fmpId'])
      .where('Families.principalId', '=', id)
      .execute();

    return result;
  }
}

export class PatientRelativesValidationRepositoryMock implements IPatientRelativesValidationRepository {
  async execute(): Promise<PatientDTO[]> {
    return [
      {
        fmpId: '239254',
      },
    ];
  }
}
