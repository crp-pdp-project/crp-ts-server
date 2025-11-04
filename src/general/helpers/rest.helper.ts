import { URL } from 'url';

import { Dispatcher, request } from 'undici';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

import { CRPConstants } from '../contants/crp.constants';

import { TextHelper } from './text.helper';

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
    const { method, path, body, headers, query, responseType } = options;
    const url = TextHelper.joinHostPath(this.host, path);

    const fullUrl = this.buildUrlWithQuery(url, query);
    const headersBase: Record<string, string> = {
      Connection: 'keep-alive',
      Accept: '*/*',
      ...headers,
    };
    if (body != null) headersBase['Content-Type'] = 'application/json';

    this.logger.info('HTTP Request Sent', {
      method,
      url: fullUrl,
      ...(body && { body }),
      ...(query && { query }),
    });

    const response = await this.handleRequest(fullUrl, headersBase, method, body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const errorText = response.body ? await response.body.text() : '';
      this.logger.error('Error HTTP Status Code', {
        method,
        url: fullUrl,
        statusCode: response.statusCode,
        result: errorText.slice(0, 2000),
      });
      throw ErrorModel.server({ message: `HTTP ${response.statusCode} error` });
    }

    return this.handleResponse<T>(response, responseType, method, fullUrl);
  }

  private async handleRequest(
    url: string,
    headers: Record<string, string>,
    method: HttpMethod,
    body?: Record<string, unknown>,
  ): Promise<Dispatcher.ResponseData> {
    const controller = new AbortController();
    const requestOptions = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    } satisfies Parameters<typeof request>[1];

    const timer = setTimeout(() => controller.abort(), CRPConstants.EXTERNAL_REQUEST_TIMEOUT);
    try {
      return request(url, requestOptions);
    } catch (error) {
      if (error instanceof Error && error?.name === 'AbortError') {
        throw ErrorModel.timeout({ message: 'External request timeout' });
      }

      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  private async handleResponse<T = unknown>(
    response: Dispatcher.ResponseData,
    responseType: ResponseType = ResponseType.JSON,
    method: HttpMethod,
    url: string,
  ): Promise<T> {
    let responseData: T;
    let logResponse = false;

    switch (responseType) {
      case ResponseType.TEXT: {
        responseData = (await response.body.text()) as T;
        logResponse = true;
        break;
      }
      case ResponseType.JSON: {
        const raw = await response.body.text();
        try {
          responseData = JSON.parse(raw) as T;
        } catch {
          responseData = raw as T;
        }
        logResponse = true;
        break;
      }
      case ResponseType.ARRAY_BUFFER: {
        const bufferArray = await response.body.arrayBuffer();
        responseData = Buffer.from(bufferArray) as T;
        break;
      }
      case ResponseType.STREAM: {
        responseData = response.body as T;
        break;
      }
    }

    this.logger.debug('HTTP Response Received', {
      method,
      url,
      statusCode: response.statusCode,
      response: logResponse ? responseData : {},
    });

    return responseData;
  }

  private buildUrlWithQuery(base: string, query: RestRequestOptions['query'] = {}): string {
    const url = new URL(base);
    for (const [key, value] of Object.entries(query)) {
      if (value == null) continue;
      url.searchParams.set(key, String(value));
    }
    return url.toString();
  }
}
