import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const SessionPayloadDTOSchema = z.object({
  email: z.coerce.string().email().optional().nullable().openapi({
    description: 'Email of the patient if available',
    example: 'email@email.com',
  }),
  phone: z.coerce.string().nullable().optional().openapi({
    description: 'Phone of the patient if available',
    example: '999999999',
  }),
});

export type SessionPayloadDTO = z.infer<typeof SessionPayloadDTOSchema>;
