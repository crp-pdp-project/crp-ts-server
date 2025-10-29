import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientProfileOutputDTOSchema } from './patientProfile.output.dto';

extendZodWithOpenApi(z);

export const PatientVerificationOutputDTOSchema = z
  .object({
    patientExternal: PatientProfileOutputDTOSchema,
    token: z.string().openapi({
      description: 'JWE Token for enroll session',
      example: 'Valid JWE',
    }),
  })
  .strict()
  .openapi({
    description: 'Patient Verification Response Body',
  });

export type PatientVerificationOutputDTO = z.infer<typeof PatientVerificationOutputDTOSchema>;
