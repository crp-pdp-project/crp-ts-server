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

export enum CRPServicePaths {
  GENERATE_TOKEN = '/token/GenerarToken',
  LIST_INSURANCES = '/PortalPacienteApi/Aseguradoras/Listar',
  LIST_GUARANTEE_LETTERS = '/CartasGarantia/Listar',
  GET_LAB_RESULT = '/Laboratorio/ObtenerInforme_Particular',
  GET_APPOINTMENT_DETAIL = '/Cita/Detalle',
  GET_X_RAY_IMAGE_URL = '/Pacs/ObtenerImagen',
  GET_POS_CONFIGURATION = '/Pago/ObtenerCredenciales',
  PAY_APPOINTMENT = '/Pago/ProcesarPagoCita',
  GET_INSURED_PATIENT = '/PlanSalud/validar-cliente',
  GET_INSURED_PATIENT_DUES = '/PlanSalud/consulta-deuda',
  PAY_CLINIC_INSURANCE = '/Pago/ProcesarPagoPlanSalud',
  AUTH_EMPLOYEES = '/Security/AutenticarUsuario',
}

export class CRPClient {
  static readonly instance: CRPClient = new CRPClient();
  private readonly host: string = EnvHelper.get('CRP_BASE_HOST');
  private readonly user: string = EnvHelper.get('CRP_USER');
  private readonly password: string = EnvHelper.get('CRP_PASSWORD');
  private readonly rest = new RestHelper(this.host);
  private token = '';
  private tokenExpiresAt = '';
  private tokenPromise: Promise<string> | null = null;

  async call<T = unknown>(options: RestRequestOptions<CRPServicePaths>): Promise<T> {
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
      path: CRPServicePaths.GENERATE_TOKEN,
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
