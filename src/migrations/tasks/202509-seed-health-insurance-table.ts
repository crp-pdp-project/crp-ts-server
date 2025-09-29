import { Insertable, Kysely } from 'kysely';

import { Database } from 'src/clients/mysql.client';

const HEALTH_INSURANCE_SEED = {
  id: 1,
  title: 'Conoce PlanSalud',
  paragraph:
    'Recibe la mejor cobertura en atención integral médica y quirúrgica en los servicios de consulta externa, emergencia, hospitalización y más.',
  subtitle: 'Beneficios:',
  bullets: JSON.stringify([
    'Afiliación sin límite de edad',
    'Mayor cobertura para enfermedades preexistentes',
    'Mayor beneficio anual por persona',
    'Más de 400 profesionales de la salud, más de 250 consultorios y más 170 camas de hospitalización.',
  ]),
  banner:
    'https://static.vecteezy.com/system/resources/thumbnails/005/720/479/small_2x/banner-abstract-background-board-for-text-and-message-design-modern-free-vector.jpg',
  pdfUrl:
    'https://portal.susalud.gob.pe/wp-content/uploads/archivo/documentacion-proyectos/siteds/componente/Especificacion-Tecnica%20SITEDSv.024.pdf',
  enabled: true,
} as unknown as Insertable<Database['HealthInsurances']>;

export async function up(db: Kysely<Database>): Promise<void> {
  await db.insertInto('HealthInsurances').values(HEALTH_INSURANCE_SEED).execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.deleteFrom('HealthInsurances').where('id', '=', HEALTH_INSURANCE_SEED.id).execute();
}
