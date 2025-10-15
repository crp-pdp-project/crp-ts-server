import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { FamilyDTO } from 'src/app/entities/dtos/service/family.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IVerifyRelativeRepository {
  execute(
    principalId: PatientDM['id'],
    relativeDocumentNumber: PatientDM['documentNumber'],
    relativeDocumentType: PatientDM['documentType'],
  ): Promise<FamilyDTO | undefined>;
}

export class VerifyRelativeRepository implements IVerifyRelativeRepository {
  async execute(
    principalId: PatientDM['id'],
    relativeDocumentNumber: PatientDM['documentNumber'],
    relativeDocumentType: PatientDM['documentType'],
  ): Promise<FamilyDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Families')
      .innerJoin('Patients as Relatives', 'Families.relativeId', 'Relatives.id')
      .select(['Families.id'])
      .where('Families.principalId', '=', principalId)
      .where('Relatives.documentNumber', '=', relativeDocumentNumber)
      .where('Relatives.documentType', '=', relativeDocumentType)
      .executeTakeFirst();

    return result as FamilyDTO;
  }
}

export class VerifyRelativeRepositoryMock implements IVerifyRelativeRepository {
  async execute(): Promise<FamilyDTO> {
    return Promise.resolve({ id: 1 });
  }
}
