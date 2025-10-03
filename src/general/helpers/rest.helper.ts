import { URL } from 'url';

import { request } from 'undici';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

export enum ResponseType {
  JSON,
  TEXT,
  ARRAY_BUFFER,
  STREAM,
}
export type RestRequestOptions<T = string> = {
  method: HttpMethod;
  path: T;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean>;
  responseType?: ResponseType;
};

export class RestHelper {
  private readonly logger: LoggerClient = LoggerClient.instance;
  private readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  async send<T = unknown>(options: RestRequestOptions): Promise<T> {
    const { method, path, body, headers, query, responseType = ResponseType.JSON } = options;
    const url = `${this.host}${path}`;

    const fullUrl = this.buildUrlWithQuery(url, query);

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        Accept: '*/*',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    } satisfies Parameters<typeof request>[1];

    this.logger.info('HTTP Request Sent', {
      method,
      url: fullUrl,
      ...(body && { body }),
      ...(query && { query }),
    });

    const response = await request(fullUrl, requestOptions);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const errorText = response.body ? await response.body.text() : '';
      this.logger.error('Error HTTP Status Code', {
        statusCode: response.statusCode,
        result: errorText.slice(0, 2000),
      });
      throw ErrorModel.server({ message: 'HTTP Error' });
    }

    let responseData: T;
    let logResponse = false;

    switch (responseType) {
      case ResponseType.TEXT:
        responseData = (await response.body.text()) as T;
        logResponse = true;
        break;
      case ResponseType.JSON:
        try {
          responseData = (await response.body.json()) as T;
        } catch {
          responseData = (await response.body.text()) as T;
        }
        logResponse = true;
        break;
      case ResponseType.ARRAY_BUFFER:
        responseData = Buffer.from(await response.body.arrayBuffer()) as T;
        break;
      case ResponseType.STREAM:
        responseData = response.body as T;
        break;
    }

    this.logger.debug('HTTP Response Received', {
      statusCode: response.statusCode,
      url: fullUrl,
      response: logResponse ? responseData : {},
    });

    return responseData;
  }

  private buildUrlWithQuery(base: string, query: RestRequestOptions['query'] = {}): string {
    const url = new URL(base);
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return url.toString();
  }
}
