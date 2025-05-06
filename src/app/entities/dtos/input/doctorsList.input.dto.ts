import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DoctorsListQueryDTOSchema = z
  .object({
    specialtyId: z.coerce.string().optional().openapi({
      description: 'Id of the specialty to filter',
      example: '2600',
    }),
  })
  .openapi({
    description: 'Doctors List Query Strings',
  });

export type DoctorsListQueryDTO = z.infer<typeof DoctorsListQueryDTOSchema>;
export interface DoctorsListInputDTO {
  Querystring: DoctorsListQueryDTO;
}
