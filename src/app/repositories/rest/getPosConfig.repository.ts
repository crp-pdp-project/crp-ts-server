import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { POSConfigDTO } from 'src/app/entities/dtos/service/posConfig.dto';
import { NiubizClient } from 'src/clients/niubiz/niubiz.client';

export interface IGetPOSConfigRepository {
  execute(os: DeviceDM['os']): Promise<POSConfigDTO>;
}

export class GetPOSConfigRepository implements IGetPOSConfigRepository {
  async execute(os: DeviceDM['os']): Promise<POSConfigDTO> {
    const client = await NiubizClient.getInstance(os);
    const POSConfig = await client.getConfig();
    return POSConfig;
  }
}

export class GetPOSConfigRepositoryMock implements IGetPOSConfigRepository {
  async execute(): Promise<POSConfigDTO> {
    return {
      user: 'anyemai@test.com',
      password: 'anyPass',
      channel: 'web',
      host: 'https://anyDomain.test/',
      commerceCode: 'anyCode',
      MDDList: 'MDD4,MDD32,MDD75,MDD77',
      correlative: 6,
      token: 'anyToken',
      pinHash: 'anyHash',
    };
  }
}
