import { ZodSchema } from 'zod';

import { ErrorResponseDTOSchema } from 'src/app/entities/dtos/output/errorResponse.output.dto';
import { IResponseStrategy } from 'src/app/interactors/response/response.interactor';

export class ErrorResponseStrategy implements IResponseStrategy {
  getSchema(): ZodSchema {
    return ErrorResponseDTOSchema;
  }
}
