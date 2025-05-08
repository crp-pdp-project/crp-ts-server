import { z } from 'zod';

import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
import { RelationshipDMSchema } from 'src/app/entities/dms/relationships.dm';

export const PatientDTOSchema = PatientDMSchema.partial().extend({
  relatives: z
    .array(
      PatientDMSchema.extend({
        relationship: RelationshipDMSchema.partial().optional(),
      }).partial(),
    )
    .optional(),
  relationship: RelationshipDMSchema.partial().optional(),
  account: AccountDMSchema.partial().nullable().optional(),
});

export type PatientDTO = z.infer<typeof PatientDTOSchema>;
