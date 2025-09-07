import { z } from 'zod';

import { DeviceDMSchema } from 'src/app/entities/dms/devices.dm';

export const DeviceDTOSchema = DeviceDMSchema.partial();

export type DeviceDTO = z.infer<typeof DeviceDTOSchema>;
