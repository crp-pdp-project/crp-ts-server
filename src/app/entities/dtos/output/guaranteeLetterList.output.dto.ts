import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { GuaranteeLetterStates } from 'src/general/enums/guaranteeLetterState.enum';

extendZodWithOpenApi(z);

export const GuaranteeLetterListOutputDTOSchema = z
  .object({
    letters: z.array(
      z.object({
        letterNumber: z.string().openapi({
          description: 'Unique identifier of the letter',
          example: '2025DI024634',
        }),
        referenceNumber: z.string().nullable().openapi({
          description: 'Reference number of the letter',
          example: null,
        }),
        service: z.string().openapi({
          description: 'Service of the letter',
          example: 'Cirugia General',
        }),
        insurance: z.string().openapi({
          description: 'Insurance of the letter',
          example: 'Plansalud',
        }),
        procedureType: z.string().openapi({
          description: 'Procedure type of the letter',
          example: 'Ambulatorio',
        }),
        coveredAmount: z.number().openapi({
          description: 'Covered amount of the letter',
          example: 1539.2,
        }),
        status: z.enum(GuaranteeLetterStates).openapi({
          description: 'Current status of the letter',
          example: GuaranteeLetterStates.APPROVED,
        }),
        rejectReason: z.string().nullable().openapi({
          description: 'Rejected reason of the letter',
          example: null,
        }),
        notes: z.string().nullable().openapi({
          description: 'Notes of the letter',
          example: null,
        }),
        procedure: z.string().nullable().openapi({
          description: 'Procedure of the letter',
          example: null,
        }),
      }),
    ),
  })
  .strict()
  .openapi({
    description: 'Availability List Response Body',
  });

export type GuaranteeLetterListOutputDTO = z.infer<typeof GuaranteeLetterListOutputDTOSchema>;
