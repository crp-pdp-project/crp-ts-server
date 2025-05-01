import { ZodSchema } from 'zod';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { ResponseModel } from 'src/app/entities/models/response.model';

export interface IResponseStrategy {
  getSchema(): ZodSchema;
}
export interface IResponseInteractor<TModel> {
  execute(model: TModel | ErrorModel): ResponseModel<TModel>;
}

export class ResponseInteractor<T> implements IResponseInteractor<T> {
  constructor(private readonly strategy: IResponseStrategy) {}

  execute(model: T | ErrorModel): ResponseModel<T> {
    try {
      const response = new ResponseModel<T>(model);
      const schema = this.strategy.getSchema();
      schema.parse(response.toResponseObject());
      return response;
    } catch (error) {
      const parsingError = ErrorModel.fromError(error);
      return new ResponseModel<T>(parsingError);
    }
  }
}
