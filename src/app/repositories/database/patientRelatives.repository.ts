import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { MysqlClient } from 'src/clients/mysql/mysql.client';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { SqlJSONHelper } from 'src/general/helpers/sqlJson.helper';

export interface IPatientRelativesRepository {
  execute(id: PatientDM['id']): Promise<PatientDTO>;
}

export class PatientRelativesRepository implements IPatientRelativesRepository {
  async execute(id: PatientDM['id']): Promise<PatientDTO> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Patients as Principal')
      .leftJoin('Families', 'Principal.id', 'Families.principalId')
      .leftJoin('Patients as Relatives', 'Families.relativeId', 'Relatives.id')
      .leftJoin('Relationships', 'Relationships.id', 'Families.relationshipId')
      .select((eb) => [
        'Principal.id',
        'Principal.fmpId',
        'Principal.nhcId',
        'Principal.firstName',
        'Principal.lastName',
        'Principal.secondLastName',
        'Principal.documentNumber',
        'Principal.documentType',
        SqlJSONHelper.jsonArrayObject(
          [
            eb.ref('Relatives.id'),
            eb.ref('Relatives.fmpId'),
            eb.ref('Relatives.nhcId'),
            eb.ref('Relatives.firstName'),
            eb.ref('Relatives.lastName'),
            eb.ref('Relatives.secondLastName'),
            eb.ref('Relatives.documentNumber'),
            eb.ref('Relatives.documentType'),
            eb.ref('Families.isVerified'),
            SqlJSONHelper.jsonObject(
              [eb.ref('Relationships.id'), eb.ref('Relationships.name'), eb.ref('Relationships.isDependant')],
              {
                checkNull: eb.ref('Relationships.id'),
              },
            ).as('relationship'),
          ],
          { checkNull: eb.ref('Relatives.id') },
        ).as('relatives'),
      ])
      .where('Principal.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }

    return result as PatientDTO;
  }
}

export class PatientRelativesRepositoryMock implements IPatientRelativesRepository {
  async execute(): Promise<PatientDTO> {
    return {
      id: 1,
      fmpId: '239254',
      nhcId: '00612719',
      firstName: 'Renato',
      lastName: 'Berrocal',
      secondLastName: 'Vignolo',
      documentNumber: '07583658',
      documentType: 14,
      relatives: [
        {
          id: 2,
          fmpId: '239254',
          nhcId: '00612719',
          firstName: 'Renato',
          lastName: 'Berrocal',
          secondLastName: 'Vignolo',
          documentNumber: '07583658',
          documentType: 14,
          isVerified: true,
          relationship: {
            id: 1,
            name: 'Hijo/a menor de edad',
            isDependant: true,
          },
        },
      ],
    };
  }
}
