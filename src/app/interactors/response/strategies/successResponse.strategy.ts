import { z, ZodSchema, ZodType } from 'zod';

import { ErrorResponseDTOSchema } from 'src/app/entities/dtos/output/errorResponse.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';

export class SuccessResponseStrategy<T> implements IResponseStrategy {
  constructor(private readonly dataSchema: ZodType<T>) {}

  getSchema(): ZodSchema {
    return z.discriminatedUnion('success', [
      SuccessResponseDTOSchema.extend({ data: this.dataSchema }),
      ErrorResponseDTOSchema,
    ]);
  }
}
