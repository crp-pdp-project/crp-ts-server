import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientAppointmentItemOutputDTOSchema } from './patientAppointmentItem.output.dto';

extendZodWithOpenApi(z);

export const PatientAppointmentListOutputDTOSchema = z
  .object({
    appointments: z.array(PatientAppointmentItemOutputDTOSchema),
  })
  .strict()
  .openapi({
    description: 'Patient Appointment Response Body',
  });

export type PatientAppointmentListOutputDTO = z.infer<typeof PatientAppointmentListOutputDTOSchema>;
