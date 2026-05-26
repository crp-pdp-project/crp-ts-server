import type { PushNotificationDTO } from 'src/app/entities/dtos/service/pushNotification.dto';
import { Devices } from 'src/app/entities/models/device/device.model';

import { LoggerClient } from '../logger/logger.client';

import { FcmPushStrategy } from './strategies/fcmPush.strategy';

export type Tokens = string[];

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export interface PushStrategy {
  sendPush(payload: PushPayload, tokens: Tokens): Promise<void>;
}

export class PushStrategyFactory {
  private static readonly strategyMap: Partial<Record<Devices, PushStrategy>> = {
    [Devices.IOS]: new FcmPushStrategy(),
    [Devices.ANDROID]: new FcmPushStrategy(),
  };

  static getStrategy(device: Devices): PushStrategy | undefined {
    const strategy = this.strategyMap[device];

    return strategy;
  }
}

export class PushClient {
  static readonly instance = new PushClient();
  readonly logger = LoggerClient.instance;

  async send(raw: PushNotificationDTO): Promise<void> {
    const groupedByDevice = raw.devices.reduce(
      (acc, device) => {
        if (device.os) {
          if (!acc[device.os]) {
            acc[device.os] = [];
          }
          if (device.pushToken) {
            acc[device.os].push(device.pushToken);
          }
        }
        return acc;
      },
      {} as Record<Devices, Tokens>,
    );

    this.logger.info('Grouped tokens by device', { groupedByDevice });

    for (const [device, tokens] of Object.entries(groupedByDevice)) {
      const strategy = PushStrategyFactory.getStrategy(device as Devices);
      if (strategy) {
        this.logger.info('Sending push notification', { device, tokens });
        const payload = this.generatePayload(raw);
        await strategy.sendPush(payload, tokens);
      }
    }
  }

  private generatePayload(raw: PushNotificationDTO): PushPayload {
    const url = raw.baseRoute ? `${raw.baseRoute}${this.toQueryString(raw.params)}` : raw.url;

    return {
      title: raw.title,
      body: raw.body,
      url,
    };
  }

  private toQueryString(params?: PushNotificationDTO['params']): string {
    if (!params) return '';

    const queryParams = Object.entries(params).map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

    return `?${queryParams.join('&')}`;
  }
}
