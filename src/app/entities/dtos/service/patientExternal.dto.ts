import { z } from 'zod';

import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';

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
  centerId: z.coerce.string(),
  gender: z.string(),
  countryId: z.coerce.string().nullable(),
  provinceId: z.coerce.string().nullable(),
  districtId: z.coerce.string().nullable(),
  zipCode: z.coerce.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.coerce.string().nullable(),
  address: z.string().nullable(),
  addressNumber: z.coerce.string().nullable(),
  addressType: z.string().nullable(),
  addressAditional: z.string().nullable(),
});

export type PatientExternalDTO = z.infer<typeof PatientExternalDTOSchema>;
