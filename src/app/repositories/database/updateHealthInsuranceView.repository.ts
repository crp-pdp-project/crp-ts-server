import { UpdateResult } from 'kysely';

import { HealthInsuranceDTO } from 'src/app/entities/dtos/service/healthInsurance.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IUpdateHealthInsuranceRepository {
  execute(healthInsurance: HealthInsuranceDTO): Promise<UpdateResult>;
}

export class UpdateHealthInsuranceRepository implements IUpdateHealthInsuranceRepository {
  async execute(healthInsurance: HealthInsuranceDTO): Promise<UpdateResult> {
    const db = MysqlClient.instance.getDb();
    return db
      .updateTable('HealthInsurances')
      .set({
        title: healthInsurance.title,
        paragraph: healthInsurance.paragraph,
        subtitle: healthInsurance.subtitle,
        bullets: JSON.stringify(healthInsurance.bullets) as unknown as string[],
        banner: healthInsurance.banner ?? null,
        pdfUrl: healthInsurance.pdfUrl,
      })
      .where('enabled', '=', true)
      .executeTakeFirstOrThrow();
  }
}

export class UpdateHealthInsuranceRepositoryMock implements IUpdateHealthInsuranceRepository {
  async execute(): Promise<UpdateResult> {
    return Promise.resolve({ numUpdatedRows: BigInt(1) });
  }
}
