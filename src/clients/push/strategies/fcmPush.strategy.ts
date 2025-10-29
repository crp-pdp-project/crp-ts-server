import { JWT } from 'google-auth-library';

import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { FirebaseConstants } from 'src/general/contants/firebase.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { RestHelper } from 'src/general/helpers/rest.helper';

import { PushPayload, PushStrategy } from '../push.client';

type ServiceAccountJson = {
  type: 'service_account';
  client_email: string;
  private_key: string;
};

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

  async sendPush(payload: PushPayload): Promise<void> {
    const token = await this.getToken();

    await this.rest.send({
      method: HttpMethod.POST,
      path: this.path,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        to: payload.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.url ? { url: payload.url } : undefined,
      },
    });
    this.logger.info('FCM push queued', {
      token: payload.token,
      title: payload.title,
      hasUrl: Boolean(payload.url),
    });
  }

  private async getToken(): Promise<string> {
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

    const { access_token } = await jwt.authorize();

    if (!access_token) {
      throw ErrorModel.server({ message: 'Unprocessable Firebase JWT' });
    }

    this.token = access_token;
    this.tokenExpiresAt = DateHelper.addMinutes(FirebaseConstants.TOKEN_TIMEOUT, 'dbDateTime');

    return access_token;
  }

  private isTokenValid(): boolean {
    return !!this.token && !DateHelper.isBeforeNow(this.tokenExpiresAt);
  }
}
