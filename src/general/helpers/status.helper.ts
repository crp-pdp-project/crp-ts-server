import { StatusCode, StatusMessage } from 'src/general/enums/status.enum';

export class StatusHelper {
  private static readonly statusMessageMap: Record<StatusCode, StatusMessage> = {
    [StatusCode.OK]: StatusMessage.OK,
    [StatusCode.CREATED]: StatusMessage.CREATED,
    [StatusCode.NO_CONTENT]: StatusMessage.NO_CONTENT,
    [StatusCode.BAD_REQUEST]: StatusMessage.BAD_REQUEST,
    [StatusCode.UNAUTHORIZED]: StatusMessage.UNAUTHORIZED,
    [StatusCode.FORBIDDEN]: StatusMessage.FORBIDDEN,
    [StatusCode.NOT_FOUND]: StatusMessage.NOT_FOUND,
    [StatusCode.CONFLICT]: StatusMessage.CONFLICT,
    [StatusCode.UNPROCESSABLE_ENTITY]: StatusMessage.UNPROCESSABLE_ENTITY,
    [StatusCode.INTERNAL_SERVER_ERROR]: StatusMessage.INTERNAL_SERVER_ERROR,
  };

  static getMessage(statusCode: StatusCode): string {
    return StatusHelper.statusMessageMap[statusCode] ?? StatusMessage.INTERNAL_SERVER_ERROR;
  }
}
