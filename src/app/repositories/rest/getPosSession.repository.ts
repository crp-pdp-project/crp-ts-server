import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { NiubizClient } from 'src/clients/niubiz/niubiz.client';

export interface IGetPOSSessionRepository {
  execute(os: DeviceDM['os'], amount: number, MDD: Record<string, unknown>): Promise<string>;
}

export class GetPOSSessionRepository implements IGetPOSSessionRepository {
  async execute(os: DeviceDM['os'], amount: number, MDD: Record<string, unknown>): Promise<string> {
    const client = await NiubizClient.getInstance(os);
    const POSSessionToken = await client.getSession(amount, MDD);
    return POSSessionToken.sessionKey;
  }
}

export class GetPOSSessionRepositoryMock implements IGetPOSSessionRepository {
  async execute(): Promise<string> {
    return Promise.resolve('anyToken');
  }
}
