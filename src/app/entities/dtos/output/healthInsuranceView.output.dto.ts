import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ViewElementDTOSchema } from '../service/viewElement.dto';

extendZodWithOpenApi(z);

export const HealthInsuranceViewOutputDTOSchema = z
  .object({
    view: z.array(ViewElementDTOSchema).openapi({
      description: 'Array of elements for the view',
    }),
    pdfUrl: z.string().openapi({
      description: 'Unique ID of the appointment',
      example: 'C202335563796',
    }),
  })
  .strip()
  .openapi({
    description: 'Patient Appointment Response Body',
  });

export type HealthInsuranceViewOutputDTO = z.infer<typeof HealthInsuranceViewOutputDTOSchema>;
