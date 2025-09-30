import http from 'http';
import https, { AgentOptions } from 'https';

import { Client, createClientAsync, WSSecurity } from 'soap';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger.client';

import { CRPConstants } from '../contants/crp.constants';
import { Environments } from '../enums/environments.enum';

import { EnvHelper } from './env.helper';

type GenericSoapFunction<TOutput> = (payload: Record<string, unknown>) => Promise<[TOutput, unknown]>;

type WSSecurityCredentials = {
  username: string;
  password: string;
  passwordType?: string;
  hasTimeStamp?: boolean;
};

export class SoapHelper<TInput> {
  private static readonly timeout: number = CRPConstants.SOAP_TIMEOUT;
  private readonly logger: LoggerClient = LoggerClient.instance;

  private constructor(private readonly client: Client) {}

  static async initClient<TInput>(
    wsdlUrl: string,
    bindingUrl: string,
    credentials?: WSSecurityCredentials,
  ): Promise<SoapHelper<TInput>> {
    const agentOptions: AgentOptions = {
      keepAlive: true,
      timeout: this.timeout,
      rejectUnauthorized: EnvHelper.getCurrentEnv() === Environments.PRD,
    };

    const client = await createClientAsync(wsdlUrl, {
      endpoint: bindingUrl,
      wsdl_options: {
        timeout: this.timeout,
        httpAgent: new http.Agent(agentOptions),
        httpsAgent: new https.Agent(agentOptions),
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
