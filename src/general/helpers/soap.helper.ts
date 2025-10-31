import { Client, createClientAsync, WSSecurity } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger/logger.client';

import { CRPConstants } from '../contants/crp.constants';

type GenericSoapFunction<TOutput> = (
  payload: Record<string, unknown>,
  options?: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) => Promise<[TOutput, unknown]>;

type WSSecurityCredentials = {
  username: string;
  password: string;
  passwordType?: string;
  hasTimeStamp?: boolean;
};

export class SoapHelper<TInput> {
  private readonly logger: LoggerClient = LoggerClient.instance;

  private constructor(private readonly client: Client) {}

  static async initClient<TInput>(
    wsdlUrl: string,
    bindingUrl: string,
    credentials?: WSSecurityCredentials,
  ): Promise<SoapHelper<TInput>> {
    try {
      const client = await createClientAsync(wsdlUrl, {
        endpoint: bindingUrl,
        wsdl_options: {
          timeout: CRPConstants.EXTERNAL_REQUEST_TIMEOUT,
        },
      });

      if (credentials) {
        const { username, password, passwordType = 'PasswordText', hasTimeStamp = false } = credentials;
        client.setSecurity(new WSSecurity(username, password, { passwordType, hasTimeStamp }));
      }

      client.on('request', (xml: string) => {
        LoggerClient.instance.debug('SOAP Request Sent', { xml });
      });

      return new SoapHelper<TInput>(client);
    } catch(error) {
      throw this.mapTimeoutError(error);
    }
  }

  async call<T = unknown>(methodName: TInput, payload: Record<string, unknown> = {}): Promise<T> {
    const rawFn = this.client[`${String(methodName)}Async`] as unknown;

    if (typeof rawFn !== 'function') {
      this.logger.error('SOAP Method Not Found', { methodName });
      throw ErrorModel.notFound({ message: 'SOAP Method Not Found' });
    }

    const fn = rawFn as GenericSoapFunction<T>;

    this.logger.info(`Calling SOAP method "${String(methodName)}"`, { payload });

    try {
      const [result, rawResponse] = await fn(payload, { timeout: CRPConstants.EXTERNAL_REQUEST_TIMEOUT });
      this.logger.debug('SOAP Response Received', { result, rawResponse });

      return result;
    } catch (error) {
      throw SoapHelper.mapTimeoutError(error);
    }
  }

  private static mapTimeoutError(error: unknown): Error {
    const typedError = error as { code?: string; connect?: boolean; message?: string };
    const msg = (typedError?.message ?? '').toLowerCase();
    const code = (typedError?.code ?? '').toUpperCase();
    const isTimeoutError = (
      code === 'ETIMEDOUT' ||
      code === 'ESOCKETTIMEDOUT' ||
      code === 'ECONNABORTED' ||
      typedError?.connect === true ||
      msg.includes('timeout')
    );

    if(isTimeoutError) {
      return ErrorModel.timeout({ message: 'SOAP request timeout' })
    }

    return error instanceof Error ? error : new Error(String(error));
  }
}
