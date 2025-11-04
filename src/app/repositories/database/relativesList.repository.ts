import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql, SqlBool } from 'kysely';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { Database, MysqlClient } from 'src/clients/mysql/mysql.client';
import { TextHelper } from 'src/general/helpers/text.helper';

type Tables = 'Families' | 'Patients' | 'Relationships';

export interface IRelativesListRepository {
  execute(
    principalId: PatientDM['id'],
    limit: number,
    search?: string,
    cursor?: PatientDM['id'],
  ): Promise<PatientDTO[]>;
}

export class RelativesListRepository implements IRelativesListRepository {
  async execute(
    principalId: PatientDM['id'],
    limit: number,
    search?: string,
    cursor?: PatientDM['id'],
  ): Promise<PatientDTO[]> {
    const db = MysqlClient.instance.getDb();
    let query = db
      .selectFrom('Families')
      .innerJoin('Patients', 'Patients.id', 'Families.relativeId')
      .innerJoin('Relationships', 'Relationships.id', 'Families.relationshipId')
      .select([
        'Patients.id',
        'Patients.fmpId',
        'Patients.nhcId',
        'Patients.firstName',
        'Patients.lastName',
        'Patients.secondLastName',
        'Patients.documentNumber',
        'Patients.documentType',
        'Patients.birthDate',
        'Patients.createdAt',
        'Patients.updatedAt',
        'Families.isVerified',
        'Relationships.isDependant',
      ])
      .orderBy('Patients.id', 'asc')
      .where('principalId', '=', principalId);

    if (search?.trim()) {
      const normalizedSearch = TextHelper.normalizeSearch(search);
      query = query.where((eb) => this.buildSearchPredicate(eb, normalizedSearch));
    }

    if (cursor != null) {
      query = query.where('Patients.id', '>', cursor);
    }

    const result = await query.limit(limit + 1).execute();

    return result as PatientDTO[];
  }

  private buildSearchPredicate(
    eb: ExpressionBuilder<Database, Tables>,
    normalizedSearch: string,
  ): ExpressionWrapper<Database, Tables, SqlBool> {
    const likeValue = `%${normalizedSearch}%`;

    const likeInsensitive = (
      expression: ExpressionWrapper<Database, Tables, string> | RawBuilder<unknown>,
    ): RawBuilder<boolean> => sql<boolean>`LOWER(${expression}) LIKE ${likeValue}`;

    const likeSensitive = (
      expression: ExpressionWrapper<Database, Tables, string> | RawBuilder<unknown>,
    ): RawBuilder<boolean> => sql<boolean>`${expression} LIKE ${likeValue}`;

    const firstNameRef = eb.ref('Patients.firstName');
    const lastNameRef = eb.ref('Patients.lastName');
    const documentNumberRef = eb.ref('Patients.documentNumber');

    const predicates = [
      likeInsensitive(firstNameRef),
      likeInsensitive(lastNameRef),
      likeInsensitive(sql`CONCAT_WS(' ', ${firstNameRef}, ${lastNameRef})`),
      likeInsensitive(sql`CONCAT_WS(' ', ${lastNameRef}, ${firstNameRef})`),
      likeSensitive(documentNumberRef),
    ];

    return eb.or(predicates);
  }
}

export class RelativesListRepositoryMock implements IRelativesListRepository {
  async execute(): Promise<PatientDTO[]> {
    return Promise.resolve([
      {
        id: 1,
        fmpId: '239254',
        nhcId: '00612719',
        firstName: 'Renato',
        lastName: 'Berrocal',
        secondLastName: 'Vignolo',
        documentNumber: '07583658',
        documentType: 14,
        createdAt: '2025-04-24 02:58:01',
        updatedAt: '2025-04-24 02:58:01',
        isVerified: true,
        isDependant: true,
      },
    ]);
  }
}
