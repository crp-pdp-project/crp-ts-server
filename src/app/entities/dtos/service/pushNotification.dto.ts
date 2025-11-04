import { z } from 'zod';

export const PushNotificationDTOSchema = z.object({
  title: z.string(),
  body: z.string(),
  tokens: z.array(z.string()),
  baseRoute: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  url: z.string().optional(),
});

export type PushNotificationDTO = z.infer<typeof PushNotificationDTOSchema>;
