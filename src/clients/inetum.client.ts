import { SoapHelper } from 'src/general/helpers/soap.helper';

export class InetumClient {
  private static instance: InetumClient;
  readonly catalog: SoapHelper;
  readonly user: SoapHelper;
  readonly citation: SoapHelper;
  readonly history: SoapHelper;
  readonly auth: SoapHelper;
  readonly fmp: SoapHelper;
  readonly results: SoapHelper;

  private constructor(
    catalogClient: SoapHelper,
    userClient: SoapHelper,
    citationClient: SoapHelper,
    historyClient: SoapHelper,
    authClient: SoapHelper,
    fmpClient: SoapHelper,
    resultsClient: SoapHelper,
  ) {
    this.catalog = catalogClient;
    this.user = userClient;
    this.citation = citationClient;
    this.history = historyClient;
    this.auth = authClient;
    this.fmp = fmpClient;
    this.results = resultsClient;
  }

  static async getInstance(): Promise<InetumClient> {
    if (!this.instance) {
      const catalogClient = await SoapHelper.initClient(
        process.env.INETUM_CATALOG_URL ?? '',
        process.env.INETUM_CATALOG_BINDING_URL ?? '',
      );
      const userClient = await SoapHelper.initClient(
        process.env.INETUM_USER_URL ?? '',
        process.env.INETUM_USER_BINDING_URL ?? '',
      );
      const citationClient = await SoapHelper.initClient(
        process.env.INETUM_CITATION_URL ?? '',
        process.env.INETUM_CITATION_BINDING_URL ?? '',
      );
      const historyClient = await SoapHelper.initClient(
        process.env.INETUM_HISTORY_URL ?? '',
        process.env.INETUM_HISTORY_BINDING_URL ?? '',
      );
      const authClient = await SoapHelper.initClient(
        process.env.INETUM_AUTH_URL ?? '',
        process.env.INETUM_AUTH_BINDING_URL ?? '',
      );
      const fmpClient = await SoapHelper.initClient(
        process.env.INETUM_FMP_URL ?? '',
        process.env.INETUM_FMP_BINDING_URL ?? '',
      );
      const resultsClient = await SoapHelper.initClient(
        process.env.INETUM_RESULTS_URL ?? '',
        process.env.INETUM_RESULTS_BINDING_URL ?? '',
      );

      this.instance = new InetumClient(
        catalogClient,
        userClient,
        citationClient,
        historyClient,
        authClient,
        fmpClient,
        resultsClient,
      );
    }

    return this.instance;
  }
}
