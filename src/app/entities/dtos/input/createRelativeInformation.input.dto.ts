import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientGender } from 'src/general/enums/patientInfo.enum';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const CreateRelativeInformationBodyDTOSchema = PatientDMSchema.pick({
  firstName: true,
  lastName: true,
  secondLastName: true,
  birthDate: true,
  documentNumber: true,
  documentType: true,
})
  .extend({
    gender: z.enum(PatientGender).openapi({
      description: 'Type of document of the patient',
      example: PatientGender.MALE,
    }),
    email: z.email().optional().openapi({
      description: 'Email of the patient if available',
      example: 'email@email.com',
    }),
    phone: z.string().optional().openapi({
      description: 'Phone of the patient if available',
      example: '999999999',
    }),
  })
  .strict()
  .openapi({
    description: 'Create relative request body',
  });

export type CreateRelativeInformationBodyDTO = z.infer<typeof CreateRelativeInformationBodyDTOSchema>;
export interface CreateRelativeInformationInputDTO {
  Body: CreateRelativeInformationBodyDTO;
}
