import { z } from 'zod';

import { FamilyDMSchema } from '../../dms/families.dm';

export const FamilyDTOSchema = FamilyDMSchema.partial();

export type FamilyDTO = z.infer<typeof FamilyDTOSchema>;
