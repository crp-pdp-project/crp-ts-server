import https from 'https';

import { Client, createClientAsync } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error.model';
import { LoggerClient } from 'src/clients/logger.client';

export class SoapHelper {
  private constructor(private readonly client: Client) {}
  private logger: LoggerClient = LoggerClient.instance;

  static async initClient(wsdlUrl: string, bindingUrl: string): Promise<SoapHelper> {
    https.globalAgent.options.rejectUnauthorized = false;
    https.globalAgent.options.checkServerIdentity = () => undefined;

    const client = await createClientAsync(wsdlUrl, {
      endpoint: bindingUrl,
      wsdl_options: {
        timeout: 30000,
      },
    });

    client.on('request', (xml: string) => {
      LoggerClient.instance.debug('SOAP Request Sent', { xml });
    });

    return new SoapHelper(client);
  }

  async call<T = unknown>(methodName: string, payload: Record<string, unknown> = {}): Promise<T> {
    const fn = this.client[`${methodName}Async`];

    if (typeof fn !== 'function') {
      this.logger.error('SOAP Method Not Found', { methodName });
      throw ErrorModel.notFound();
    }

    this.logger.debug(`Calling SOAP method "${methodName}"`, { payload });

    const [result, rawResponse] = await fn(payload);
    this.logger.debug('SOAP Response Received', { result, rawResponse });

    return result as T;
  }
}
