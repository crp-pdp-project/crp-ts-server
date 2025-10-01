import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const AppointmentDocumentPDFParamsDTOSchema = PatientDMSchema.pick({
  fmpId: true,
})
  .extend({
    documentId: z.string().openapi({
      description: 'Unique ID of the appointment document',
      example: 'C202335563796',
    }),
  })
  .strict()
  .openapi({
    description: 'Get appointment pdf request params',
  });

export type AppointmentDocumentPDFParamsDTO = z.infer<typeof AppointmentDocumentPDFParamsDTOSchema>;
export interface AppointmentDocumentPDFInputDTO {
  Params: AppointmentDocumentPDFParamsDTO;
}
