import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { SoapHelper } from 'src/general/helpers/soap.helper';

export enum SitedsServices {
  INSURANCE_DETAILS = 'getConsultaAsegNom',
  INSURANCE_PRICES = 'getConsultaAsegCod',
}

export class SitedsClient {
  private static instance: SitedsClient;
  readonly client: SoapHelper<SitedsServices>;

  private constructor(client: SoapHelper<SitedsServices>) {
    this.client = client;
  }

  static async getInstance(): Promise<SitedsClient> {
    if (!this.instance) {
      const client = await SoapHelper.initClient<SitedsServices>(
        EnvHelper.get('SITEDS_URL'),
        EnvHelper.get('SITEDS_BINDING_URL'),
        CRPConstants.SITEDS_REQUEST_TIMEOUT,
        {
          username: EnvHelper.get('SITEDS_USER'),
          password: EnvHelper.get('SITEDS_PASSWORD'),
        },
      );

      this.instance = new SitedsClient(client);
    }

    return this.instance;
  }
}
