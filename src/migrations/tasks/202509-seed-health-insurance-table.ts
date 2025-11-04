import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql/mysql.client';

const HEALTH_INSURANCE_SEED = {
  id: 1,
  title: 'Conoce PlanSalud',
  paragraph:
    'La Clínica Ricardo Palma, en su constante búsqueda por brindar a nuestra comunidad excelencia en servicios integrales de salud, ha desarrollado PlanSalud, un programa con exclusivos beneficios en el mercado.',
  subtitle: 'Beneficios:',
  bullets: JSON.stringify([
    'Afiliación sin límite de edad.',
    'Mayor cobertura para enfermedades preexistentes.',
    'Mayor beneficio anual por persona.',
    'Más de 400 profesionales de la salud, más de 250 consultorios y más 170 camas de hospitalización a tu servicio.',
    'Plantel médico exclusivo PlanSalud.',
    'Beneficios en consulta externa, farmacia, emergencias, hospitalización, entre otros.',
    'Chequeo anual preventivo sin costo pasado los 90 días de carencia.',
  ]),
  pdfUrl: 'https://www.crp.com.pe/wp-content/uploads/2018/10/Folleto-Informativo-PlanSalud.pdf',
  enabled: true,
} as unknown as Insertable<Database['HealthInsurances']>;

export async function up(db: Kysely<Database>): Promise<void> {
  await db.insertInto('HealthInsurances').values(HEALTH_INSURANCE_SEED).execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.deleteFrom('HealthInsurances').where('id', '=', HEALTH_INSURANCE_SEED.id).execute();
}
