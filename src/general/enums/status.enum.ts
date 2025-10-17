export enum StatusCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  PRECONDITION_REQUIRED = 428,
  INTERNAL_SERVER_ERROR = 500,
}

export enum StatusMessage {
  OK = 'Ok',
  NO_CONTENT = 'No Content',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  LOCKED = 'Locked',
  PRECONDITION_REQUIRED = 'Precondition Required',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export class StatusCodesMapper {
  private static readonly statusMessageMap: Record<StatusCode, StatusMessage> = {
    [StatusCode.OK]: StatusMessage.OK,
    [StatusCode.NO_CONTENT]: StatusMessage.NO_CONTENT,
    [StatusCode.BAD_REQUEST]: StatusMessage.BAD_REQUEST,
    [StatusCode.UNAUTHORIZED]: StatusMessage.UNAUTHORIZED,
    [StatusCode.FORBIDDEN]: StatusMessage.FORBIDDEN,
    [StatusCode.NOT_FOUND]: StatusMessage.NOT_FOUND,
    [StatusCode.CONFLICT]: StatusMessage.CONFLICT,
    [StatusCode.UNPROCESSABLE_ENTITY]: StatusMessage.UNPROCESSABLE_ENTITY,
    [StatusCode.LOCKED]: StatusMessage.LOCKED,
    [StatusCode.PRECONDITION_REQUIRED]: StatusMessage.PRECONDITION_REQUIRED,
    [StatusCode.INTERNAL_SERVER_ERROR]: StatusMessage.INTERNAL_SERVER_ERROR,
  };

  static getStatusMessage(statusCode: StatusCode): StatusMessage {
    return this.statusMessageMap[statusCode];
  }
}
