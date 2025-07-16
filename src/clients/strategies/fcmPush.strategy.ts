import { HttpMethod } from 'src/general/enums/methods.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';

import { LoggerClient } from '../logger.client';
import { PushPayload, PushStrategy } from '../push.client';
import { RestClient } from '../rest.client';

export class FcmPushStrategy implements PushStrategy {
  private readonly url: string = EnvHelper.get('FCM_URL');
  private readonly key: string = EnvHelper.get('FCM_SERVER_KEY');
  private readonly rest: RestClient = RestClient.instance;
  private readonly logger: LoggerClient = LoggerClient.instance;

  async sendPush(payload: PushPayload): Promise<void> {
    await this.rest.send({
      method: HttpMethod.POST,
      url: this.url,
      headers: {
        Authorization: `key=${this.key}`,
      },
      body: {
        to: payload.token,
        priority: 'high',
        notification: {
          title: payload.title,
          body: payload.body,
          sound: 'default',
        },
        data: {
          url: payload.url,
        },
      },
    });

    this.logger.info('FCM push queued', {
      token: payload.token,
      title: payload.title,
    });
  }
}
