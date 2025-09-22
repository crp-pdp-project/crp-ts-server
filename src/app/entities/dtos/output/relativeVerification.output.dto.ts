import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const RelativeVerificationOutputDTOSchema = PatientDMSchema.pick({
  id: true,
})
  .strict()
  .openapi({
    description: 'Relative verification Response Body',
  });

export type RelativeVerificationOutputDTO = z.infer<typeof RelativeVerificationOutputDTOSchema>;
