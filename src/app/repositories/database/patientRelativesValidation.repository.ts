import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface IPatientRelativesValidationRepository {
  execute(id: PatientDM['id']): Promise<PatientDTO[]>;
}

export class PatientRelativesValidationRepository implements IPatientRelativesValidationRepository {
  async execute(id: PatientDM['id']): Promise<PatientDTO[]> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Families')
      .innerJoin('Patients as Relatives', 'Families.relativeId', 'Relatives.id')
      .innerJoin('Relationships', 'Families.relationshipId', 'Relationships.id')
      .select((eb) => [
        'Relatives.fmpId',
        'Relatives.nhcId',
        'Relatives.documentNumber',
        'Relatives.documentType',
        'Families.isVerified',
        SqlJSONHelper.jsonObject([eb.ref('Relationships.isDependant')], {}).as('relationship'),
      ])
      .where('Families.principalId', '=', id)
      .execute();

    return result as PatientDTO[];
  }
}

export class PatientRelativesValidationRepositoryMock implements IPatientRelativesValidationRepository {
  async execute(): Promise<PatientDTO[]> {
    return [
      {
        fmpId: '239254',
        isVerified: true,
        relationship: {
          isDependant: true,
        },
      },
    ];
  }
}
