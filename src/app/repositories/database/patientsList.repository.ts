import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql, SqlBool } from 'kysely';

import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { Database, MysqlClient } from 'src/clients/mysql/mysql.client';
import { TextHelper } from 'src/general/helpers/text.helper';

export interface IPatientsListRepository {
  execute(limit: number, search?: string, cursor?: PatientDM['id']): Promise<PatientDTO[]>;
}

export class PatientsListRepository implements IPatientsListRepository {
  async execute(limit: number, search?: string, cursor?: PatientDM['id']): Promise<PatientDTO[]> {
    const db = MysqlClient.instance.getDb();
    let query = db.selectFrom('Patients').selectAll().orderBy('id', 'asc');

    if (search?.trim()) {
      const normalizedSearch = TextHelper.normalizeSearch(search);
      query = query.where((eb) => this.buildSearchPredicate(eb, normalizedSearch));
    }

    if (cursor != null) {
      query = query.where('id', '>=', cursor);
    }

    const result = await query.limit(limit + 1).execute();

    return result as PatientDTO[];
  }

  private buildSearchPredicate(
    eb: ExpressionBuilder<Database, 'Patients'>,
    normalizedSearch: string,
  ): ExpressionWrapper<Database, 'Patients', SqlBool> {
    const likeValue = `%${normalizedSearch}%`;

    const likeInsensitive = (
      expression: ExpressionWrapper<Database, 'Patients', string> | RawBuilder<unknown>,
    ): RawBuilder<boolean> => sql<boolean>`LOWER(${expression}) LIKE ${likeValue}`;

    const likeSensitive = (
      expression: ExpressionWrapper<Database, 'Patients', string> | RawBuilder<unknown>,
    ): RawBuilder<boolean> => sql<boolean>`${expression} LIKE ${likeValue}`;

    const firstNameRef = eb.ref('firstName');
    const lastNameRef = eb.ref('lastName');
    const documentNumberRef = eb.ref('documentNumber');

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

export class PatientsListRepositoryMock implements IPatientsListRepository {
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
      },
    ]);
  }
}
