import { z } from 'zod';

export const AppointmentTransactionResultDTOSchema = z.object({
  id: z.string().nullable().optional(),
  errorCode: z.number(),
  errorDescription: z.string().nullable(),
});

export type AppointmentTransactionResultDTO = z.infer<typeof AppointmentTransactionResultDTOSchema>;
