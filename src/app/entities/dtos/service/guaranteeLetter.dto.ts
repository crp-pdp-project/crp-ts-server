import { z } from 'zod';

export const GuaranteeLetterDTOSchema = z.object({
  letterNumber: z.string().optional(),
  referenceNumber: z.string().nullable().optional(),
  service: z.string().optional(),
  insurance: z.string().optional(),
  procedureType: z.string().optional(),
  coveredAmount: z.number().optional(),
  status: z.string().optional(),
  rejectReason: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  procedure: z.string().nullable().optional(),
});

export type GuaranteeLetterDTO = z.infer<typeof GuaranteeLetterDTOSchema>;
