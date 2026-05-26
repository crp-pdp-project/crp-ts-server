import { z } from 'zod';

import { DeviceDTOSchema } from './device.dto';

export const PushNotificationDTOSchema = z.object({
  title: z.string(),
  body: z.string(),
  devices: z.array(DeviceDTOSchema),
  baseRoute: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  url: z.string().optional(),
});

export type PushNotificationDTO = z.infer<typeof PushNotificationDTOSchema>;
