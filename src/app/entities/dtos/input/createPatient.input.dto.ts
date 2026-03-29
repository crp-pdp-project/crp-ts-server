import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientGender } from 'src/general/enums/patientInfo.enum';

import { PatientDMSchema } from '../../dms/patients.dm';

extendZodWithOpenApi(z);

export const CreatePatientBodyDTOSchema = PatientDMSchema.pick({
  firstName: true,
  lastName: true,
  birthDate: true,
  documentNumber: true,
  documentType: true,
})
  .extend({
    secondLastName: z.preprocess(
      (value) => typeof value === 'string' && value.trim() === '' ? null : value,
      z.string().nullable().optional(),
    ).openapi({
      description: 'Last Name of the patient',
      example: 'Vignolo',
    }),
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
    description: 'Enroll Patient request Body',
  });

export type CreatePatientBodyDTO = z.infer<typeof CreatePatientBodyDTOSchema>;
export interface CreatePatientInputDTO {
  Body: CreatePatientBodyDTO;
}
