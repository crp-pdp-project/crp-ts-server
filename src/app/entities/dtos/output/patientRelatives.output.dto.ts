import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from '../../dms/patients.dm';
import { RelationshipDMSchema } from '../../dms/relationships.dm';

extendZodWithOpenApi(z);

export const PatientRelativesOutputDTOSchema = PatientDMSchema.pick({
  id: true,
  fmpId: true,
  nhcId: true,
  firstName: true,
  lastName: true,
  secondLastName: true,
  documentNumber: true,
  documentType: true,
})
  .extend({
    relatives: z
      .array(
        PatientDMSchema.pick({
          id: true,
          fmpId: true,
          nhcId: true,
          firstName: true,
          lastName: true,
          secondLastName: true,
          documentNumber: true,
          documentType: true,
        }).extend({
          relationship: RelationshipDMSchema.pick({
            id: true,
            name: true,
          }).openapi({
            description: 'Relationship of the patient',
          }),
        }),
      )
      .openapi({
        description: 'Relatives array of the patient',
      }),
    relationship: RelationshipDMSchema.pick({
      id: true,
      name: true,
    }).openapi({
      description: 'Relationship of the patient',
    }),
  })
  .strict()
  .openapi({
    description: 'Patient Profile Response Body',
  });

export type PatientRelativesOutputDTO = z.infer<typeof PatientRelativesOutputDTOSchema>;
