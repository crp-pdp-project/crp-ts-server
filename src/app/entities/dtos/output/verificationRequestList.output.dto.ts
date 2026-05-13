import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { FamilyDMSchema } from '../../dms/families.dm';
import { PatientDMSchema } from '../../dms/patients.dm';
import { RelationshipDMSchema } from '../../dms/relationships.dm';

extendZodWithOpenApi(z);

export const VerificationRequestListOutputDTOSchema = z
  .object({
    list: z.array(
      PatientDMSchema.extend({
        isVerified: FamilyDMSchema.shape.isVerified,
        isDependant: RelationshipDMSchema.shape.isDependant,
        principal: PatientDMSchema,
      }),
    ),
    hasNext: z.boolean().openapi({
      description: 'The list has a next page',
      example: true,
    }),
    nextCursor: z.number().int().positive().nullable().openapi({
      description: 'Next cursor to be used',
      example: 1,
    }),
  })
  .strip()
  .openapi({
    description: 'Patient List Response Body',
  });

export type VerificationRequestListOutputDTO = z.infer<typeof VerificationRequestListOutputDTOSchema>;
