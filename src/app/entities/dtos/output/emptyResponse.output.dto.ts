import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
extendZodWithOpenApi(z);

export const EmptyResponseDTOSchema = z.object({
  success: z.literal(true).openapi({
    description: 'Indicates the request was successful.',
    example: true,
  }),
  statusCode: z.literal(StatusCode.NO_CONTENT).openapi({
    description: 'HTTP status code for the success response',
    example: StatusCode.NO_CONTENT,
  }),
  statusMessage: z.literal(StatusMessage.NO_CONTENT).openapi({
    description: 'Textual description of the status.',
    example: StatusMessage.NO_CONTENT,
  }),
});

export type EmptyResponseDTO = z.infer<typeof EmptyResponseDTOSchema>;
