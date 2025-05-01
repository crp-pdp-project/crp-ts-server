import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export const ErrorResponseDTOSchema = z.object({
  success: z.literal(false).openapi({
    description: 'Indicates the request failed.',
    example: false,
  }),
  statusCode: z.number().min(400).max(599).openapi({
    description: 'HTTP status code for the error.',
    example: 599,
  }),
  statusMessage: z.string().openapi({
    description: 'Textual description of the status.',
    example: 'HTTP Error',
  }),
  message: z.string().openapi({
    description: 'Raw internal error message intended for the developer.',
    example: 'Generic error',
  }),
  detail: z.string().openapi({
    description: 'Detailed explanation of the error intentend for the consumer.',
    example: 'User with ID 123 does not exist.',
  }),
});

export type ErrorResponseDTO = z.infer<typeof ErrorResponseDTOSchema>;
