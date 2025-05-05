import { z, ZodSchema } from 'zod';

import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { ErrorResponseDTOSchema } from 'src/app/entities/dtos/output/errorResponse.output.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';

export class EmptyResponseStrategy implements IResponseStrategy {
  getSchema(): ZodSchema {
    return z.discriminatedUnion('success', [EmptyResponseDTOSchema, ErrorResponseDTOSchema]);
  }
}
