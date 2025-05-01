import { z, ZodSchema, ZodType } from 'zod';

import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/service/emptyResponse.dto';
import { ErrorResponseDTOSchema } from 'src/app/entities/dtos/service/errorResponse.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/service/successResponse.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';

export class HybridResponseStrategy<T> implements IResponseStrategy {
  constructor(private readonly dataSchema: ZodType<T>) {}

  getSchema(): ZodSchema {
    return z.discriminatedUnion('success', [
      SuccessResponseDTOSchema.extend({ data: this.dataSchema }),
      EmptyResponseDTOSchema,
      ErrorResponseDTOSchema,
    ]);
  }
}
