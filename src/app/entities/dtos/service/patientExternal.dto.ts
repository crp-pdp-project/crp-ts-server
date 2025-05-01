import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
extendZodWithOpenApi(z);

export const PatientExternalDTOSchema = PatientDMSchema.pick({
  fmpId: true,
  nhcId: true,
  firstName: true,
  lastName: true,
  secondLastName: true,
  birthDate: true,
  documentNumber: true,
  documentType: true,
}).extend({
  centerId: z.string().openapi({
    description: 'Id of the center used for validation',
    example: '123456',
  }),
  gender: z.string().openapi({
    description: 'Gender of the patient, (H=Masculine, M=Femenine)',
    example: 'H',
  }),
  countryId: z.coerce.string().nullable().openapi({
    description: 'Id of the country of the patient if available',
    example: '604',
  }),
  provinceId: z.coerce.string().nullable().openapi({
    description: 'Id of the province of the patient if available',
    example: '1501',
  }),
  districtId: z.coerce.string().nullable().openapi({
    description: 'Id of the district of the patient if available',
    example: '1501',
  }),
  zipCode: z.coerce.string().nullable().openapi({
    description: 'Zip code of the patient if available',
    example: '15046',
  }),
  email: z.coerce.string().email().nullable().openapi({
    description: 'Email of the patient if available',
    example: 'email@email.com',
  }),
  phone: z.coerce.string().nullable().openapi({
    description: 'Phone of the patient if available',
    example: '999999999',
  }),
  address: z.coerce.string().nullable().openapi({
    description: 'Address of the patient if available',
    example: 'LOS ROBLES',
  }),
  addressNumber: z.coerce.string().nullable().openapi({
    description: 'Address number of the patient if available',
    example: '242',
  }),
  addressType: z.coerce.string().nullable().openapi({
    description: 'Address type of the patient if available',
    example: '27',
  }),
  addressAditional: z.coerce.string().nullable().openapi({
    description: 'Address additional information of the patient if available',
    example: 'A ESPALDAS DEL CENTRO COMERCIAL',
  }),
});

export type PatientExternalDTO = z.infer<typeof PatientExternalDTOSchema>;
