import { EnvHelper } from 'src/general/helpers/env.helper';
import { SoapHelper } from 'src/general/helpers/soap.helper';

export enum InetumCatalogServices {
  LIST_SPECIALTIES = 'ListadoEspecialidades',
  LIST_DOCTORS = 'ListadoProfesionales',
  LIST_APPOINTMENT_TYPES = 'ListadoPrestaciones',
}

export enum InetumUserServices {
  CONFIRM_PATIENT = 'Alta',
  CREATE_PATIENT_NHC = 'CrearPacienteEnCentros',
}

export enum InetumAppointmentServices {
  LIST_CURRENT_APPOINTMENTS = 'ListadoCitas',
  LIST_HISTORIC_APPOINTMENTS = 'ListadoConsultas',
  GET_DOCTOR_AVAILABILITY = 'ListadoHuecosDisponibles',
  CREATE_APPOINTMENT = 'AltaCita',
  RESCHEDULE_APPOINTMENT = 'ModificarCita',
  CANCEL_APPOINTMENT = 'AnularCita',
}

export enum InetumHistoryServices {
  LIST_DOCUMENTS = 'ListadoInformes',
  LIST_RESULTS = 'ListadoPruebasDiagnosticas',
  GET_PDF_DOCUMENT = 'ObtenerInformePdf',
  CREATE_PATIENT_NHC = 'CrearPacienteEnCentros',
}

export enum InetumFmpServices {
  SEARCH_PATIENT = 'ConsultaPacientes',
}

export class InetumClient {
  private static instance: InetumClient;
  readonly catalog: SoapHelper<InetumCatalogServices>;
  readonly user: SoapHelper<InetumUserServices>;
  readonly appointment: SoapHelper<InetumAppointmentServices>;
  readonly history: SoapHelper<InetumHistoryServices>;
  readonly fmp: SoapHelper<InetumFmpServices>;

  private constructor(
    catalogClient: SoapHelper<InetumCatalogServices>,
    userClient: SoapHelper<InetumUserServices>,
    appointmentClient: SoapHelper<InetumAppointmentServices>,
    historyClient: SoapHelper<InetumHistoryServices>,
    fmpClient: SoapHelper<InetumFmpServices>,
  ) {
    this.catalog = catalogClient;
    this.user = userClient;
    this.appointment = appointmentClient;
    this.history = historyClient;
    this.fmp = fmpClient;
  }

  static async getInstance(): Promise<InetumClient> {
    if (!this.instance) {
      const catalogClient = await SoapHelper.initClient<InetumCatalogServices>(
        EnvHelper.get('INETUM_CATALOG_URL'),
        EnvHelper.get('INETUM_CATALOG_BINDING_URL'),
      );
      const userClient = await SoapHelper.initClient<InetumUserServices>(
        EnvHelper.get('INETUM_USER_URL'),
        EnvHelper.get('INETUM_USER_BINDING_URL'),
      );
      const appointmentClient = await SoapHelper.initClient<InetumAppointmentServices>(
        EnvHelper.get('INETUM_APPOINTMENT_URL'),
        EnvHelper.get('INETUM_APPOINTMENT_BINDING_URL'),
      );
      const historyClient = await SoapHelper.initClient<InetumHistoryServices>(
        EnvHelper.get('INETUM_HISTORY_URL'),
        EnvHelper.get('INETUM_HISTORY_BINDING_URL'),
      );
      const fmpClient = await SoapHelper.initClient<InetumFmpServices>(
        EnvHelper.get('INETUM_FMP_URL'),
        EnvHelper.get('INETUM_FMP_BINDING_URL'),
      );

      this.instance = new InetumClient(catalogClient, userClient, appointmentClient, historyClient, fmpClient);
    }

    return this.instance;
  }
}
