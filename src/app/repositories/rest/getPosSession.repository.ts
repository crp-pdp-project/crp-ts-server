import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { POSConfigDTO } from 'src/app/entities/dtos/service/posConfig.dto';
import { NiubizClient } from 'src/clients/niubiz/niubiz.client';

export interface IGetPOSSessionRepository {
  execute(os: DeviceDM['os'], config: POSConfigDTO, amount: number, MDD: Record<string, unknown>): Promise<string>;
}

export class GetPOSSessionRepository implements IGetPOSSessionRepository {
  async execute(
    os: DeviceDM['os'],
    config: POSConfigDTO,
    amount: number,
    MDD: Record<string, unknown>,
  ): Promise<string> {
    const client = await NiubizClient.createClinet(os, config);
    const POSSessionToken = await client.getSession(amount, MDD, config.token!);
    return POSSessionToken.sessionKey;
  }
}

export class GetPOSSessionRepositoryMock implements IGetPOSSessionRepository {
  async execute(): Promise<string> {
    return Promise.resolve('anyToken');
  }
}
