import { ZodDiscriminatedUnion, ZodObject, ZodRawShape } from 'zod';

import { BaseModel } from 'src/app/entities/models/base.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';

import { DataResponseStrategy } from './strategies/dataResponse.strategy';
import { EmptyResponseStrategy } from './strategies/emptyResponse.strategy';
import { ErrorResponseStrategy } from './strategies/errorResponse.strategy';
import { MixedResponseStrategy } from './strategies/mixedResponse.strategy';

export interface IResponseStrategy {
  getSchema(): ZodDiscriminatedUnion;
}

export interface IResponseManager {
  validateResponse(model?: BaseModel | ErrorModel): ResponseModel;
}

export class ResponseManager implements IResponseManager {
  constructor(private readonly strategy: IResponseStrategy) {}

  validateResponse(model?: BaseModel | ErrorModel): ResponseModel {
    try {
      const schema = this.strategy.getSchema();
      const response = new ResponseModel(model, schema);
      return response;
    } catch (error) {
      const parsingError = ErrorModel.fromError(error);
      return new ResponseModel(parsingError);
    }
  }
}

export class ResponseManagerBuilder {
  static buildError(): ResponseManager {
    return new ResponseManager(new ErrorResponseStrategy());
  }

  static buildEmpty(): ResponseManager {
    return new ResponseManager(new EmptyResponseStrategy());
  }

  static buildData(dataSchema: ZodObject<ZodRawShape>): ResponseManager {
    return new ResponseManager(new DataResponseStrategy(dataSchema));
  }

  static buildMixed(dataSchema: ZodObject<ZodRawShape>): ResponseManager {
    return new ResponseManager(new MixedResponseStrategy(dataSchema));
  }
}
