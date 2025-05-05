import { Client, createClientAsync } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { LoggerClient } from 'src/clients/logger.client';

type GenericSoapFunction<T> = (payload: Record<string, unknown>) => Promise<[T, unknown]>;

export class SoapHelper {
  private constructor(private readonly client: Client) {}
  private logger: LoggerClient = LoggerClient.instance;

  static async initClient(wsdlUrl: string, bindingUrl: string): Promise<SoapHelper> {
    const client = await this.tryInit(wsdlUrl, bindingUrl);

    client.on('request', (xml: string) => {
      LoggerClient.instance.debug('SOAP Request Sent', { xml });
    });

    return new SoapHelper(client);
  }

  private static async tryInit(wsdlUrl: string, bindingUrl: string, attempt = 1): Promise<Client> {
    try {
      const client = await createClientAsync(wsdlUrl, {
        endpoint: bindingUrl,
        wsdl_options: {
          timeout: 30000,
        },
      });

      return client;
    } catch (error) {
      LoggerClient.instance.warn(
        `Attempt ${attempt} failed: ${error instanceof Error ? error.message : String(error)}`,
      );

      if (attempt >= 3) {
        LoggerClient.instance.error(`Failed after 3 attempts`);
        throw error;
      }

      await new Promise((res) => setTimeout(res, 1000));
      return this.tryInit(wsdlUrl, bindingUrl, attempt + 1);
    }
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
