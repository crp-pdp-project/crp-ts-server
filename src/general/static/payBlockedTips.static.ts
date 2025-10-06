import { TipDTO } from 'src/app/entities/dtos/service/tip.dto';

export default [
  {
    title: 'Recomendaciones para tu cita:',
    content: ['Llega 30min. antes de tu cita.', 'Recuerda que toda atención es presentando el DNI o CE física.'],
  },
  {
    title: 'Sobre el pago:',
    content: ['Podrás realizar el pago de tu cita acercándote a la clínica el día de la misma.'],
  },
] as const satisfies readonly TipDTO[];
