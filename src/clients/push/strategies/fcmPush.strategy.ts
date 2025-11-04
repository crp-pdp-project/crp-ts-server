import { JWT } from 'google-auth-library';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { FirebaseConstants } from 'src/general/contants/firebase.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { RestHelper } from 'src/general/helpers/rest.helper';

import { PushPayload, PushStrategy, Tokens } from '../push.client';

type ServiceAccountJson = {
  type: 'service_account';
  client_email: string;
  private_key: string;
};

type PromiseFunctionArray = (() => Promise<void>)[];

export class FcmPushStrategy implements PushStrategy {
  private readonly projectId: string = EnvHelper.get('FCM_PROJECT_ID');
  private readonly host: string = EnvHelper.get('FCM_HOST');
  private readonly path: string = `${FirebaseConstants.BASE_PATH}${this.projectId}${FirebaseConstants.OPERATION}`;
  private readonly serviceAccount: string = EnvHelper.get('FCM_SERVICE_ACCOUNT');
  private readonly rest: RestHelper = new RestHelper(this.host);
  private readonly logger: LoggerClient = LoggerClient.instance;
  private token = '';
  private tokenExpiresAt = '';
  private tokenPromise: Promise<string> | null = null;

  async sendPush(payload: PushPayload, tokens: Tokens): Promise<void> {
    const accessToken = await this.getAccessToken();
    const tasks = this.createPromiseArray(payload, tokens, accessToken);
    const chunkedTasks = this.chunkTasks(tasks);
    const results = await this.runChunks(chunkedTasks);

    const fulfilledResults = results.filter((result) => result.status === 'fulfilled');
    const rejectedResults = results.filter((result) => result.status === 'rejected');

    this.logger.info('FCM push queued', {
      fulfilled: fulfilledResults.length,
      rejected: rejectedResults.length,
      payload,
    });
  }

  private async runChunks(chunks: PromiseFunctionArray[]): Promise<PromiseSettledResult<void>[]> {
    const results: PromiseSettledResult<void>[] = [];

    for (const chunk of chunks) {
      const promises = chunk.map((run) => run());
      const settled = await Promise.allSettled(promises);

      results.push(...settled);
    }

    return results;
  }

  private chunkTasks(tasks: PromiseFunctionArray): PromiseFunctionArray[] {
    const chunks = [];
    const chunkSize = FirebaseConstants.BATCH_SIZE;
    for (let index = 0; index < tasks.length; index += chunkSize) {
      chunks.push(tasks.slice(index, index + chunkSize));
    }

    return chunks;
  }

  private createPromiseArray(payload: PushPayload, tokens: Tokens, accessToken: string): PromiseFunctionArray {
    const tasks = tokens.map((deviceToken) => async (): Promise<void> => {
      try {
        await this.rest.send({
          method: HttpMethod.POST,
          path: this.path,
          headers: { Authorization: `Bearer ${accessToken}` },
          body: {
            message: {
              token: deviceToken,
              notification: { title: payload.title, body: payload.body },
              data: payload.url ? { url: payload.url } : undefined,
            },
          },
        });
      } catch (error) {
        const formattedError = ErrorModel.fromError(error);
        this.logger.error('FCM push failed', { token: deviceToken, message: formattedError.message });

        throw formattedError;
      }
    });

    return tasks;
  }

  private async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.token;
    }

    if (this.tokenPromise) return this.tokenPromise;

    this.tokenPromise = this.fetchNewToken();
    const token = await this.tokenPromise;

    this.tokenPromise = null;

    return token;
  }

  private loadServiceAccountFromEnv(): ServiceAccountJson {
    const json = Buffer.from(this.serviceAccount, 'base64').toString('utf8');
    return JSON.parse(json) as ServiceAccountJson;
  }

  private async fetchNewToken(): Promise<string> {
    const account = this.loadServiceAccountFromEnv();

    const jwt = new JWT({
      email: account.client_email,
      key: account.private_key,
      scopes: [...FirebaseConstants.DEFAULT_SCOPES],
    });

    const { access_token, expiry_date } = await jwt.authorize();

    if (!access_token) {
      throw ErrorModel.server({ message: 'Unprocessable Firebase JWT' });
    }

    this.token = access_token;
    this.tokenExpiresAt = expiry_date
      ? DateHelper.toFormatDateTime(expiry_date, 'dbDateTime')
      : DateHelper.addMinutes(FirebaseConstants.TOKEN_TIMEOUT, 'dbDateTime');

    return access_token;
  }

  private isTokenValid(): boolean {
    return !!this.token && !DateHelper.isBeforeNow(this.tokenExpiresAt);
  }
}
