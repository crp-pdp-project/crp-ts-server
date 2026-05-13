import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const PayAppointmentParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    appointmentId: z.string().openapi({
      description: 'Unique ID of the appointment',
      example: 'C202335563796',
    }),
  })
  .strict()
  .openapi({
    description: 'Pay appointment request params',
  });

export const PayAppointmentBodyDTOSchema = z
  .object({
    authorization: z.object({
      commerceCode: z.string().openapi({
        description: 'Unique code for the POS',
        example: 'anyCode',
      }),
      correlative: z.string().openapi({
        description: 'Unique number of the transaction',
        example: '000000006',
      }),
      tokenId: z.string().openapi({
        description: 'Unique code of the tokenized card',
        example: 'anyCode',
      }),
    }),
    siteds: z.string().openapi({
      description: 'Encoded siteds response',
      example: 'anyBase64',
    }),
  })
  .strict()
  .openapi({
    description: 'Pay appointment Request Body',
  });

export type PayAppointmentBodyDTO = z.infer<typeof PayAppointmentBodyDTOSchema>;
export type PayAppointmentParamsDTO = z.infer<typeof PayAppointmentParamsDTOSchema>;
export interface PayAppointmentInputDTO {
  Body: PayAppointmentBodyDTO;
  Params: PayAppointmentParamsDTO;
}
