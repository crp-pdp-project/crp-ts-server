import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientAppointmentOutputDTOSchema } from './patientAppointment.output.dto';

extendZodWithOpenApi(z);

export const PatientAppointmentDetailOutputDTOSchema = PatientAppointmentOutputDTOSchema.extend({
  siteds: z
    .object({
      base64: z.string().openapi({
        description: 'Encoded siteds response',
        example: 'anyBase64',
      }),
      amount: z.number().openapi({
        description: 'Amount to pay',
        example: 0,
      }),
    })
    .optional()
    .openapi({
      description: 'Siteds result',
    }),
})
  .strip()
  .openapi({
    description: 'Patient Appointment Detail Response Body',
  });

export type PatientAppointmentDetailOutputDTO = z.infer<typeof PatientAppointmentDetailOutputDTOSchema>;
