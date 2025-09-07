import { TipDTO } from 'src/app/entities/dtos/service/tip.dto';

export default [
  {
    title: 'Recuerda:',
    content: [
      'Para el proceso de devolución del pago, deberás acercarte al área de atención al paciente con el documento correspondiente.',
    ],
  },
] as const satisfies readonly TipDTO[];
