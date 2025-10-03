import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { SitedsDocumentType } from 'src/general/enums/patientInfo.enum';

extendZodWithOpenApi(z);

export const SitedsPriceOutputDTOSchema = z
  .object({
    ipressId: z.string().openapi({
      description: 'Unique ipress ID of the clinic',
      example: '00009409',
    }),
    iafaId: z.string().openapi({
      description: 'Unique ipress ID of the insurance',
      example: '20004',
    }),
    date: z.string().openapi({
      description: 'Transaction date in DD-MM-YYYY',
      example: '01-01-2025',
    }),
    time: z.string().openapi({
      description: 'Transaction time HH:mm:ss',
      example: '00:00:00',
    }),
    details: z
      .array(
        z.object({
          patientEntityType: z.string().openapi({
            description: 'Entity type of the patient',
            example: 'PERSONA NATURAL',
          }),
          patientLastName: z.string().openapi({
            description: 'Last name of the patient',
            example: 'VARGAS',
          }),
          patientFirstName: z.string().openapi({
            description: 'First name of the patient',
            example: 'JOSE LUIS',
          }),
          patientMemberId: z.string().openapi({
            description: 'Unique member ID of the patient',
            example: '0006102542',
          }),
          patientSecondLastName: z.string().openapi({
            description: 'Second last name of the patient',
            example: 'ARANA',
          }),
          patientDocumentType: z.enum(SitedsDocumentType).openapi({
            description: 'Document type of the patient',
            example: SitedsDocumentType.DNI,
          }),
          patientDocumentNumber: z.string().openapi({
            description: 'Document number of the patient',
            example: '72905847',
          }),
          productCode: z.string().openapi({
            description: 'Code of the product for the selected iafa',
            example: 'R',
          }),
          productDescription: z.string().openapi({
            description: 'Description of the product',
            example: 'SEGURO COMPLEM. TRABAJO DE RIESGO',
          }),
          contractorEntityType: z.string().openapi({
            description: 'Entity type of the contractor',
            example: 'PERSONA JURIDICA',
          }),
          contractorFirstName: z.string().openapi({
            description: 'Name of the contractor',
            example: 'WORLD LOGISTIC S.A.C. WORLD LOGISTI',
          }),
          contractorDocumentType: z.string().openapi({
            description: 'Document type of the contractor',
            example: 'RUC',
          }),
          contractorIdQualifier: z.string().openapi({
            description: 'Unique qualifier ID of the contractor',
            example: 'XX5',
          }),
          contractorId: z.string().openapi({
            description: 'Unique ID of the contractor',
            example: '20513408090',
          }),
          coverages: z
            .array(
              z.object({
                coverageTypeCode: z.string().openapi({
                  description: 'Type of the coverage',
                  example: 'AMBULATORIO',
                }),
                coverageSubtypeCode: z.string().openapi({
                  description: 'Subtype of the coverage',
                  example: '100',
                }),
                currencyCode: z.string().openapi({
                  description: 'Currency of the coverage',
                  example: 'SOLES',
                }),
                copayFixed: z.number().openapi({
                  description: 'Fixed amount to pay for the coverage',
                  example: 0,
                }),
                serviceCalcCode: z.string().openapi({
                  description: 'Service code of the coverage',
                  example: 'ZU',
                }),
                serviceCalcQuantity: z.number().openapi({
                  description: 'Service quantity of the coverage',
                  example: 0,
                }),
                copayVariable: z.number().openapi({
                  description: 'Covered percentage amount of the coverage',
                  example: 100,
                }),
                taxAmount: z.number().openapi({
                  description: 'Amount to be pay in taxes for the coverage',
                  example: 0,
                }),
                preTaxAmount: z.number().openapi({
                  description: 'Net amount the coverage',
                  example: 0,
                }),
              }),
            )
            .openapi({
              description: 'Array of siteds coverages',
            }),
        }),
      )
      .openapi({
        description: 'Array of siteds patient details',
      }),
  })
  .strict()
  .openapi({
    description: 'Siteds Price Response Body',
  });

export type SitedsPriceOutputDTO = z.infer<typeof SitedsPriceOutputDTOSchema>;
