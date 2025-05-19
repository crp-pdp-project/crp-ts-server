import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
extendZodWithOpenApi(z);

export const OkResponseDTOSchema = z
  .object({
    success: z.literal(true).openapi({
      description: 'Indicates the request was successful.',
      example: true,
    }),
    statusCode: z.literal(StatusCode.OK).openapi({
      description: 'HTTP status code for the success response',
      example: StatusCode.OK,
    }),
    statusMessage: z.literal(StatusMessage.OK).openapi({
      description: 'Textual description of the status.',
      example: StatusMessage.OK,
    }),
  })
  .strict();

export type OkResponseDTO = z.infer<typeof OkResponseDTOSchema>;
