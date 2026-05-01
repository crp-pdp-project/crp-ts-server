import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DoctorsListQueryDTOSchema = z
  .object({
    specialtyId: z.coerce.string().optional().openapi({
      description: 'Id of the specialty to filter',
      example: '2600',
    }),
    groupId: z.coerce.string().optional().openapi({
      description: 'Id of the specialty group to filter',
      example: '9',
    }),
    appointmentTypeId: z.coerce.string().optional().openapi({
      description: 'Id of the appointmentType to filter',
      example: '900-10010020',
    }),
    insuranceId: z.coerce.string().optional().openapi({
      description: 'Id of the insurance to filter',
      example: '16023',
    }),
    inspectionId: z.coerce.string().optional().openapi({
      description: 'Id of the insurance inspection to filter',
      example: '99',
    }),
  })
  .strict()
  .openapi({
    description: 'Doctors List Query Strings',
  });

export type DoctorsListQueryDTO = z.infer<typeof DoctorsListQueryDTOSchema>;
export interface DoctorsListInputDTO {
  Querystring: DoctorsListQueryDTO;
}
