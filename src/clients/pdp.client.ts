import { CRPConstants } from 'src/general/contants/crp.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { RestHelper, RestRequestOptions } from 'src/general/helpers/rest.helper';

type AuthTokenInput = {
  Usuario: string;
  Contrasenia: string;
};

type AuthTokenOutput = {
  data: string;
  esCorrecto: boolean;
  mensaje: string;
};

export enum PDPServicePaths {
  GENERATE_TOKEN = '/Token/GenerarToken',
  GET_DOCTOR_IMAGES = '/Medico/ObtenerDatosMedico',
}

export class PDPClient {
  static readonly instance: PDPClient = new PDPClient();
  private readonly host: string = EnvHelper.get('PDP_BASE_HOST');
  private readonly user: string = EnvHelper.get('PDP_USER');
  private readonly password: string = EnvHelper.get('PDP_PASSWORD');
  private readonly rest = new RestHelper(this.host);
  private token = '';
  private tokenExpiresAt = '';
  private tokenPromise: Promise<string> | null = null;

  async call<T = unknown>(options: RestRequestOptions<PDPServicePaths>): Promise<T> {
    const token = await this.getToken();
    const result = await this.rest.send<T>({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return result as T;
  }

  private async getToken(): Promise<AuthTokenOutput['data']> {
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
    const authTokenInput = this.parseTokenInput();

    const tokenResponse = await this.rest.send<AuthTokenOutput>({
      method: HttpMethod.POST,
      path: PDPServicePaths.GENERATE_TOKEN,
      body: authTokenInput,
    });

    this.token = tokenResponse.data;
    this.tokenExpiresAt = DateHelper.addMinutes(CRPConstants.TOKEN_TIMEOUT, 'dbDateTime');
    return this.token;
  }

  private isTokenValid(): boolean {
    return !!this.token && !DateHelper.checkExpired(this.tokenExpiresAt);
  }

  private parseTokenInput(): AuthTokenInput {
    return {
      Usuario: this.user,
      Contrasenia: this.password,
    };
  }
}
