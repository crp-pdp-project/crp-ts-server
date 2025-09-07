import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PushDataTypes } from 'src/general/enums/pushDataTypes.enum';
extendZodWithOpenApi(z);

export const PushConfigDMSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique ID of the push config',
    example: 1,
  }),
  screen: z.string().openapi({
    description: 'Screen to redirect on push notification',
    example: 'appointments',
  }),
  config: z.array(
    z.object({
      name: z.string().openapi({
        description: 'Name of the param to be required',
        example: 'appointmentId',
      }),
      type: z.enum(PushDataTypes).openapi({
        description: 'Type of the param to be required',
        example: PushDataTypes.STRING,
      }),
      isRequired: z.boolean().openapi({
        description: 'Is the param required',
        example: false,
      }),
    }),
  ),
  createdAt: z.string().openapi({
    description: 'Creation date of the push config in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update of the push config in DD-MM-YYYY HH:mm:ss',
    example: '01-01-2025 00:00:00',
  }),
});

export type PushConfigDM = z.infer<typeof PushConfigDMSchema>;
