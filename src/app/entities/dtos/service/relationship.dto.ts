import { z } from 'zod';

import { RelationshipDMSchema } from 'src/app/entities/dms/relationships.dm';

export const RelationshipDTOSchema = RelationshipDMSchema.partial();

export type RelationshipDTO = z.infer<typeof RelationshipDTOSchema>;
