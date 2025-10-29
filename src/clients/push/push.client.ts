import { Devices } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';

import { FcmPushStrategy } from './strategies/fcmPush.strategy';

export type RawPayload = {
  title: string;
  body: string;
  token: string;
  baseRoute?: string;
  params?: Record<string, string | number | boolean>;
  url?: string;
};

export type PushPayload = {
  title: string;
  body: string;
  token: string;
  url?: string;
};

export interface PushStrategy {
  sendPush(payload: PushPayload): Promise<void>;
}

export class PushStrategyFactory {
  private static readonly strategyMap: Partial<Record<Devices, PushStrategy>> = {
    [Devices.IOS]: new FcmPushStrategy(),
    [Devices.ANDROID]: new FcmPushStrategy(),
  };

  static getStrategy(device: Devices): PushStrategy {
    const strategy = this.strategyMap[device];
    if (!strategy) {
      throw ErrorModel.notFound({ message: 'Device not found' });
    }

    return strategy;
  }
}

export class PushClient {
  static readonly instance = new PushClient();

  async send(device: Devices, raw: RawPayload): Promise<void> {
    const strategy = PushStrategyFactory.getStrategy(device);
    const payload = this.generatePayload(raw);
    await strategy.sendPush(payload);
  }

  private generatePayload(raw: RawPayload): PushPayload {
    const url = raw.baseRoute ? `${raw.baseRoute}${this.toQueryString(raw.params)}` : raw.url;

    return {
      title: raw.title,
      body: raw.body,
      token: raw.token,
      url,
    };
  }

  private toQueryString(params?: RawPayload['params']): string {
    if (!params) return '';

    const queryParams = Object.entries(params).map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

    return `?${queryParams.join('&')}`;
  }
}
