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
})
  .partial()
  .extend({
    centerId: z.coerce.string().optional(),
    gender: z.string().optional(),
    countryId: z.coerce.string().nullable().optional(),
    provinceId: z.coerce.string().nullable().optional(),
    districtId: z.coerce.string().nullable().optional(),
    zipCode: z.coerce.string().nullable().optional(),
    email: z.email().nullable().optional(),
    phone: z.coerce.string().nullable().optional(),
    address: z.string().nullable().optional(),
    addressNumber: z.coerce.string().nullable().optional(),
    addressType: z.string().nullable().optional(),
    addressAditional: z.string().nullable().optional(),
  });

export type PatientExternalDTO = z.infer<typeof PatientExternalDTOSchema>;
