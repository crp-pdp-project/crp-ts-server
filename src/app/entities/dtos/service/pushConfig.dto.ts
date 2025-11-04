import { z } from 'zod';

import { PushConfigDMSchema } from '../../dms/pushConfigs.dm';

export const PushConfigDTOSchema = PushConfigDMSchema.partial();

export type PushConfigDTO = z.infer<typeof PushConfigDTOSchema>;
