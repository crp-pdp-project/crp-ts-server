import { z } from 'zod';

import { ConNom271DetailDTOSchema } from './conNom271Detail.dto';

export const ConNom271DTOSchema = z.object({
  ipressId: z.string().optional(),
  iafaId: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  shortDate: z.string().optional(),
  shortTime: z.string().optional(),
  correlative: z.string().optional(),
  transactionId: z.string().optional(),
  purposeCode: z.string().optional(),
  senderEntityType: z.string().optional(),
  receiverEntityType: z.string().optional(),
  receiverTaxId: z.string().optional(),
  groupControlNumber: z.string().optional(),
  transactionSetControlNumber: z.string().optional(),
  details: z.array(ConNom271DetailDTOSchema).optional(),
});

export type ConNom271DTO = z.infer<typeof ConNom271DTOSchema>;
