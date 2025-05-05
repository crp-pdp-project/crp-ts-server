import { z } from 'zod';

export const SessionPayloadDTOSchema = z.object({
  email: z.string().email().nullable().optional(),
  phone: z.coerce.string().nullable().optional(),
});

export type SessionPayloadDTO = z.infer<typeof SessionPayloadDTOSchema>;
