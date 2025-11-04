import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { PushNotificationDTO } from 'src/app/entities/dtos/service/pushNotification.dto';
import { PushClient } from 'src/clients/push/push.client';

export interface ISendPushNotificationRepository {
  execute(device: DeviceDM['os'], notification: PushNotificationDTO): Promise<void>;
}

export class SendPushNotificationRepository implements ISendPushNotificationRepository {
  private readonly client = PushClient.instance;

  async execute(device: DeviceDM['os'], notification: PushNotificationDTO): Promise<void> {
    await this.client.send(device, notification);
  }
}

export class SendPushNotificationRepositoryMock implements ISendPushNotificationRepository {
  async execute(): Promise<void> {
    return Promise.resolve();
  }
}
