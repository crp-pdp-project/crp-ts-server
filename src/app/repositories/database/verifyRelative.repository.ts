import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { MysqlClient } from 'src/clients/mysql.client';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IVerifyRelativeRepository {
  execute(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<PatientDTO>;
}

export class VerifyRelativeRepository implements IVerifyRelativeRepository {
  async execute(principalId: PatientDM['id'], relativeId: PatientDM['id']): Promise<PatientDTO> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('Families')
      .select(['id'])
      .where('principalId', '=', principalId)
      .where('relativeId', '=', relativeId)
      .executeTakeFirst();

    if (!result) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_FOUND });
    }

    return result as PatientDTO;
  }
}

export class VerifyRelativeRepositoryMock implements IVerifyRelativeRepository {
  async execute(): Promise<PatientDTO> {
    return { id: 1 };
  }
}
