import { ZodDiscriminatedUnion } from 'zod';

import { BaseModel } from 'src/app/entities/models/base.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { StatusCode, StatusCodesMapper, StatusMessage } from 'src/general/enums/status.enum';

export type ErrorResponse = {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  detail: string;
};

export type SuccessResponse = {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  data?: Record<string, unknown>;
};

export class ResponseModel {
  readonly body: ErrorResponse | SuccessResponse;
  readonly statusCode: number;

  constructor(
    private readonly data?: BaseModel | ErrorModel,
    private readonly dataSchema?: ZodDiscriminatedUnion,
  ) {
    switch (true) {
      case this.data instanceof ErrorModel:
        this.statusCode = this.data.statusCode;
        this.body = this.validateErrorResponse(this.data, this.dataSchema);
        break;
      case !!this.data:
        this.statusCode = StatusCode.OK;
        this.body = this.validateSuccessResponse(this.data, this.dataSchema);
        break;
      default:
        this.statusCode = StatusCode.NO_CONTENT;
        this.body = this.validateEmptyResponse(this.dataSchema);
        break;
    }
  }

  private validateSuccessResponse(data: BaseModel, dataSchema?: ZodDiscriminatedUnion): SuccessResponse {
    const body = {
      success: true,
      statusCode: StatusCode.OK,
      statusMessage: StatusMessage.OK,
      data: data.toPlainObject(),
    };

    return (dataSchema ? dataSchema.parse(body) : body) as SuccessResponse;
  }

  private validateEmptyResponse(dataSchema?: ZodDiscriminatedUnion): SuccessResponse {
    const body = {
      success: true,
      statusCode: StatusCode.NO_CONTENT,
      statusMessage: StatusMessage.NO_CONTENT,
    };

    return (dataSchema ? dataSchema.parse(body) : body) as SuccessResponse;
  }

  private validateErrorResponse(data: ErrorModel, dataSchema?: ZodDiscriminatedUnion): ErrorResponse {
    const body = {
      success: false,
      statusCode: data.statusCode,
      statusMessage: StatusCodesMapper.getStatusMessage(data.statusCode),
      message: data.message,
      detail: data.detail,
    };

    return (dataSchema ? dataSchema.parse(body) : body) as ErrorResponse;
  }
}
