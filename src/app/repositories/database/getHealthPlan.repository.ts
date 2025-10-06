import { HealthInsuranceDTO } from 'src/app/entities/dtos/service/healthInsurance.dto';
import { MysqlClient } from 'src/clients/mysql/mysql.client';

export interface IGetHealthInsuranceRepository {
  execute(): Promise<HealthInsuranceDTO | undefined>;
}

export class GetHealthInsuranceRepository implements IGetHealthInsuranceRepository {
  async execute(): Promise<HealthInsuranceDTO | undefined> {
    const db = MysqlClient.instance.getDb();
    const result = await db
      .selectFrom('HealthInsurances')
      .select(['title', 'paragraph', 'subtitle', 'bullets', 'banner', 'pdfUrl'])
      .where('enabled', '=', true)
      .executeTakeFirst();
    return result;
  }
}

export class GetHealthInsuranceRepositoryMock implements IGetHealthInsuranceRepository {
  async execute(): Promise<HealthInsuranceDTO | undefined> {
    return {
      title: 'Conoce PlanSalud',
      paragraph:
        'Recibe la mejor cobertura en atención integral médica y quirúrgica en los servicios de consulta externa, emergencia, hospitalización y más.',
      subtitle: 'Beneficios:',
      bullets: [
        'Afiliación sin límite de edad',
        'Mayor cobertura para enfermedades preexistentes',
        'Mayor beneficio anual por persona',
        'Más de 400 profesionales de la salud, más de 250 consultorios y más 170 camas de hospitalización.',
      ],
      banner: 'https://www.vecteezy.com/free-vector/background-banner',
      pdfUrl:
        'https://portal.susalud.gob.pe/wp-content/uploads/archivo/documentacion-proyectos/siteds/componente/Especificacion-Tecnica%20SITEDSv.024.pdf',
    };
  }
}
