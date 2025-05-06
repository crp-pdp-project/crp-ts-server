import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

extendZodWithOpenApi(z);

export const SignInPatientOutputDTOSchema = z
  .object({
    patient: PatientDMSchema.pick({
      id: true,
      firstName: true,
      lastName: true,
      secondLastName: true,
    }),
    token: z.string().openapi({
      description: 'JWE Token for enroll session',
      example: 'Valid JWE',
    }),
  })
  .openapi({
    description: 'Sign In Patient Response Body',
  });

export type SignInPatientOutputDTO = z.infer<typeof SignInPatientOutputDTOSchema>;
