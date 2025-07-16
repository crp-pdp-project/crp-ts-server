import { EnvHelper } from 'src/general/helpers/env.helper';
import { SoapHelper } from 'src/general/helpers/soap.helper';

export class InetumClient {
  private static instance: InetumClient;
  readonly catalog: SoapHelper;
  readonly user: SoapHelper;
  readonly appointment: SoapHelper;
  readonly history: SoapHelper;
  readonly auth: SoapHelper;
  readonly fmp: SoapHelper;
  readonly results: SoapHelper;

  private constructor(
    catalogClient: SoapHelper,
    userClient: SoapHelper,
    appointmentClient: SoapHelper,
    historyClient: SoapHelper,
    authClient: SoapHelper,
    fmpClient: SoapHelper,
    resultsClient: SoapHelper,
  ) {
    this.catalog = catalogClient;
    this.user = userClient;
    this.appointment = appointmentClient;
    this.history = historyClient;
    this.auth = authClient;
    this.fmp = fmpClient;
    this.results = resultsClient;
  }

  static async getInstance(): Promise<InetumClient> {
    if (!this.instance) {
      const catalogClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_CATALOG_URL'),
        EnvHelper.get('INETUM_CATALOG_BINDING_URL'),
      );
      const userClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_USER_URL'),
        EnvHelper.get('INETUM_USER_BINDING_URL'),
      );
      const appointmentClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_APPOINTMENT_URL'),
        EnvHelper.get('INETUM_APPOINTMENT_BINDING_URL'),
      );
      const historyClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_HISTORY_URL'),
        EnvHelper.get('INETUM_HISTORY_BINDING_URL'),
      );
      const authClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_AUTH_URL'),
        EnvHelper.get('INETUM_AUTH_BINDING_URL'),
      );
      const fmpClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_FMP_URL'),
        EnvHelper.get('INETUM_FMP_BINDING_URL'),
      );
      const resultsClient = await SoapHelper.initClient(
        EnvHelper.get('INETUM_RESULTS_URL'),
        EnvHelper.get('INETUM_RESULTS_BINDING_URL'),
      );

      this.instance = new InetumClient(
        catalogClient,
        userClient,
        appointmentClient,
        historyClient,
        authClient,
        fmpClient,
        resultsClient,
      );
    }

    return this.instance;
  }
}
