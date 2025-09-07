import { Client, createClientAsync } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger.client';

import { CRPConstants } from '../contants/crp.constants';

type GenericSoapFunction<TOutput> = (payload: Record<string, unknown>) => Promise<[TOutput, unknown]>;

export class SoapHelper<TInput> {
  private static readonly timeout: number = CRPConstants.SOAP_TIMEOUT;
  private readonly logger: LoggerClient = LoggerClient.instance;

  private constructor(private readonly client: Client) {}

  static async initClient<TInput>(wsdlUrl: string, bindingUrl: string): Promise<SoapHelper<TInput>> {
    const client = await createClientAsync(wsdlUrl, {
      endpoint: bindingUrl,
      wsdl_options: {
        timeout: this.timeout,
      },
    });

    client.on('request', (xml: string) => {
      LoggerClient.instance.debug('SOAP Request Sent', { xml });
    });

    return new SoapHelper<TInput>(client);
  }

  async call<T = unknown>(methodName: TInput, payload: Record<string, unknown> = {}): Promise<T> {
    const rawFn = this.client[`${String(methodName)}Async`] as unknown;

    if (typeof rawFn !== 'function') {
      this.logger.error('SOAP Method Not Found', { methodName });
      throw ErrorModel.notFound({ message: 'SOAP Method Not Found' });
    }

    const fn = rawFn as GenericSoapFunction<T>;

    this.logger.info(`Calling SOAP method "${String(methodName)}"`, { payload });

    const [result, rawResponse] = await fn(payload);
    this.logger.debug('SOAP Response Received', { result, rawResponse });

    return result;
  }
}
