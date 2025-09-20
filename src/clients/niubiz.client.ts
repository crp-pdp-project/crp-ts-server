import { DeviceDM } from 'src/app/entities/dms/devices.dm';
import { POSConfigDTO, POSConfigDTOSchema } from 'src/app/entities/dtos/service/posConfig.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { RestHelper } from 'src/general/helpers/rest.helper';

import { CRPClient, CRPServicePaths } from './crp.client';

type GetPOSConfigInput = {
  tipoCanal: string;
};

type GetPOSConfigOutput = {
  data: {
    usuario: string;
    contrasenia: string;
    canal: string;
    url: string;
    comercio: string;
    merchantDefineData: string;
    purchaseNumber: number;
  };
  esCorrecto: boolean;
};

type GetPinHashOutput = {
  pinHash: string;
  expireDate: string;
};

export enum NiubizServicePaths {
  GENERATE_TOKEN = 'api.security/v1/security',
  GET_HASH = 'api.certificate/v1/query',
}

export class NiubizClient {
  private static instances = new Map<DeviceDM['os'], NiubizClient>();
  private readonly overridePinHash?: string = EnvHelper.getOptional('NIUBIZ_PIN_HASH');
  private readonly config: POSConfigDTO;
  private readonly rest: RestHelper;
  private token = '';
  private tokenExpiresAt = '';
  private tokenPromise: Promise<string> | null = null;

  private constructor(config: POSConfigDTO) {
    const parsedConfig = POSConfigDTOSchema.omit({
      token: true,
      pinHash: true,
    })
      .required()
      .parse(config);
    this.config = parsedConfig;
    this.rest = new RestHelper(parsedConfig.host);
  }

  async getConfig(): Promise<POSConfigDTO> {
    const token = await this.getToken();
    const response: POSConfigDTO = {
      ...this.config,
      token: this.token,
      pinHash: this.overridePinHash,
    };

    if (!this.overridePinHash) {
      const result = await this.rest.send<GetPinHashOutput>({
        path: `${NiubizServicePaths.GET_HASH}/${this.config.commerceCode}`,
        method: HttpMethod.POST,
        headers: {
          Authorization: token,
        },
      });
      response.pinHash = result.pinHash;
    }

    return response;
  }

  static async getInstance(os: DeviceDM['os']): Promise<NiubizClient> {
    const existing = this.instances.get(os);
    if (existing) return existing;

    const config = await this.getConfig(os);
    const client = new NiubizClient(config);
    this.instances.set(os, client);
    return client;
  }

  private static async getConfig(os: DeviceDM['os']): Promise<POSConfigDTO> {
    const configInput = this.parseInput(os);
    const rawResult = await CRPClient.instance.call<GetPOSConfigOutput>({
      method: HttpMethod.GET,
      path: CRPServicePaths.GET_POS_CONFIGURATION,
      query: configInput,
    });

    return this.parseOutput(rawResult);
  }

  private static parseInput(os: DeviceDM['os']): GetPOSConfigInput {
    return {
      tipoCanal: os,
    };
  }

  private static parseOutput(rawResult: GetPOSConfigOutput): POSConfigDTO {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.badRequest({ message: 'Cannot obtain POS configuration' });
    }

    const configuration: POSConfigDTO = {
      user: data.usuario,
      password: data.contrasenia,
      commerceCode: data.comercio,
      channel: data.canal,
      host: data.url,
      MDDList: data.merchantDefineData,
      correlative: data.purchaseNumber,
    };

    return configuration;
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

  private async fetchNewToken(): Promise<string> {
    const signature = Buffer.from(`${this.config.user}:${this.config.password}`).toString('base64');

    const token = await this.rest.send<string>({
      method: HttpMethod.GET,
      path: NiubizServicePaths.GENERATE_TOKEN,
      headers: {
        Authorization: `Basic ${signature}`,
      },
    });

    this.token = token;
    this.tokenExpiresAt = DateHelper.addMinutes(CRPConstants.TOKEN_TIMEOUT, 'dbDateTime');
    return this.token;
  }

  private isTokenValid(): boolean {
    return !!this.token && !DateHelper.checkExpired(this.tokenExpiresAt);
  }
}
