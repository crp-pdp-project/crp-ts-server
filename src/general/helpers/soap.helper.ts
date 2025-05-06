import { Client, createClientAsync } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { LoggerClient } from 'src/clients/logger.client';

type GenericSoapFunction<T> = (payload: Record<string, unknown>) => Promise<[T, unknown]>;

export class SoapHelper {
  private static readonly timeout: number = Number(process.env.INETUM_TIMEOUT ?? 5000);
  private logger: LoggerClient = LoggerClient.instance;

  private constructor(private readonly client: Client) {}
  
  static async initClient(wsdlUrl: string, bindingUrl: string): Promise<SoapHelper> {
    const client = await createClientAsync(wsdlUrl, {
      endpoint: bindingUrl,
      wsdl_options: {
        timeout: this.timeout,
      },
    });

    client.on('request', (xml: string) => {
      LoggerClient.instance.debug('SOAP Request Sent', { xml });
    });

    return new SoapHelper(client);
  }

  async call<T = unknown>(methodName: string, payload: Record<string, unknown> = {}): Promise<T> {
    const rawFn = this.client[`${methodName}Async`] as unknown;

    if (typeof rawFn !== 'function') {
      this.logger.error('SOAP Method Not Found', { methodName });
      throw ErrorModel.notFound();
    }

    const fn = rawFn as GenericSoapFunction<T>;

    this.logger.info(`Calling SOAP method "${methodName}"`, { payload });

    const [result, rawResponse] = await fn(payload);
    this.logger.debug('SOAP Response Received', { result, rawResponse });

    return result;
  }
}
