import { TipDTO } from 'src/app/entities/dtos/service/tip.dto';

export default [
  {
    title: 'Recomendaciones para tu cita:',
    content: [
      'Llega 30min. antes de tu cita.',
      'En caso de haber realizado el pago dirígete directamente al piso de tu especialidad.',
      'Recuerda que toda atención es presentando el DNI o CE física.',
    ],
  },
  {
    title: 'Sobre el pago:',
    content: ['Podrás realizar el pago de tu cita por aquí 7 días antes de la fecha de agendamiento.'],
  },
] as const satisfies readonly TipDTO[];
