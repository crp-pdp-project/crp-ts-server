import { z } from 'zod';

export const ConCod271DetailDTOSchema = z.object({
  benefitInfo: z.string().optional(),
  coverageNumber: z.string().optional(),
  initialMaxBenefit: z.string().optional(),
  coverageAmount: z.string().optional(),
  restrictionIndicatorCode: z.string().optional(),
  serviceQuantity: z.string().optional(),
  productId: z.string().optional(),
  coverageTypeCode: z.string().optional(),
  coverageSubtypeCode: z.string().optional(),
  notesMessage: z.string().optional(),
  specialConditionsMessage: z.string().optional(),
  currencyCode: z.string().optional(),
  copayFixed: z.string().optional(),
  serviceCalcCode: z.string().optional(),
  serviceCalcQuantity: z.string().optional(),
  copayVariable: z.string().optional(),
  guaranteeFlag: z.string().optional(),
  guaranteeFlagDetail: z.string().optional(),
  waitingPeriodEndDate: z.string().optional(),
  eliminationPeriodEndDate: z.string().optional(),
});

export type ConCod271DetailDTO = z.infer<typeof ConCod271DetailDTOSchema>;
