import { BaseModel } from 'src/app/entities/models/base.model';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';
import { StatusHelper } from 'src/general/helpers/status.helper';

export type ErrorResponse = {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  detail: string;
};

export type SuccessResponse<T> = {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  data?: T;
};

export class ResponseModel<T> {
  private readonly body: ErrorResponse | SuccessResponse<T>;
  readonly statusCode: number;

  constructor(private readonly data?: T | ErrorModel) {
    switch (true) {
      case this.data instanceof ErrorModel:
        this.statusCode = this.data.statusCode;
        this.body = {
          success: false,
          statusCode: this.data.statusCode,
          statusMessage: StatusHelper.getMessage(this.data.statusCode),
          message: this.data.message,
          detail: this.data.detail,
        };
        break;
      case !!this.data:
        this.statusCode = StatusCode.OK;
        this.body = {
          success: true,
          statusCode: StatusCode.OK,
          statusMessage: StatusMessage.OK,
          data: this.transformData(this.data),
        };
        break;
      default:
        this.statusCode = StatusCode.NO_CONTENT;
        this.body = {
          success: true,
          statusCode: StatusCode.NO_CONTENT,
          statusMessage: StatusMessage.NO_CONTENT,
        };
        break;
    }
  }

  private transformData(data: T | ErrorModel): T {
    if (data instanceof BaseModel) {
      return data.toPlainObject() as T;
    }
    return data;
  }

  toResponseObject(): ErrorResponse | SuccessResponse<T> {
    return Object.fromEntries(Object.entries(this.body).filter(([_, value]) => value !== undefined)) as
      | ErrorResponse
      | SuccessResponse<T>;
  }
}
