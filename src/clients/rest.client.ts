import { URL } from 'url';

import { request } from 'undici';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { LoggerClient } from 'src/clients/logger.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type RestRequestOptions = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean>;
};

export class RestClient {
  static readonly instance = new RestClient();
  private readonly logger = LoggerClient.instance;

  async send<T = unknown>(options: RestRequestOptions): Promise<T> {
    const { method, url, body, headers, query } = options;

    const fullUrl = this.buildUrlWithQuery(url, query);

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
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
      this.logger.error('Error HTTP Status Code', {
        statusCode: response.statusCode,
        result: await response.body.text(),
      });
      throw ErrorModel.server({ message: 'HTTP Error' });
    }

    let responseData: T;

    try {
      responseData = (await response.body.json()) as T;
    } catch {
      responseData = (await response.body.text()) as T;
    }

    this.logger.debug('HTTP Response Received', {
      statusCode: response.statusCode,
      url: fullUrl,
      response: responseData,
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
