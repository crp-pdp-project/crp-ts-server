import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
import { RelationshipDMSchema } from 'src/app/entities/dms/relationships.dm';

extendZodWithOpenApi(z);

export const PatientDTOSchema = PatientDMSchema.partial().extend({
  relatives: z.array(PatientDMSchema.partial()).nullable().optional().openapi({
    description: 'Array of family members',
  }),
  relationship: RelationshipDMSchema.partial().nullable().optional().openapi({
    description: 'Relationship information of the family member',
  }),
  account: AccountDMSchema.partial().nullable().optional().openapi({
    description: 'Patient account information',
  }),
});

export type PatientDTO = z.infer<typeof PatientDTOSchema>;
