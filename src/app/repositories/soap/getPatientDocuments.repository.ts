import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientReportDTO } from 'src/app/entities/dtos/service/patientReport.dto';
import { InetumClient, InetumHistoryServices } from 'src/clients/inetum/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import type { Months } from 'src/general/helpers/date.helper';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetPatientDocumentsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoInformesPaciente: {
    IdPaciente: string;
    IdCentro: string;
    FechaDesde?: string;
    FechaHasta?: string;
    NumRegistros: string;
    CanalEntrada: string;
    IdCita?: string;
  };
};

type GetPatientDocumentsOutput = {
  ListadoInformesResult: {
    Informe: {
      InformeRespuesta: {
        IdEpisodio: string;
        Fecha: string;
        Hora: string;
        IdCentro: string;
        NombrePrestacion: string;
        NombreAgrupacion: string;
        NombreProfesional: string;
        Tipo: string;
        TituloInforme: string;
        idSociedad: string;
        IdAgrupacion: string;
        FechaUtc: string;
        IdActo: string;
      }[];
    };
  };
};

export type GetAppointmentDocumentsPayload = {
  fmpId: PatientDM['fmpId'];
  appointmentId?: string;
  year?: number;
  month?: Months;
};

export interface IGetPatientDocumentsRepository {
  execute(payload: GetAppointmentDocumentsPayload): Promise<PatientReportDTO[]>;
}

export class GetPatientDocumentsRepository implements IGetPatientDocumentsRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(payload: GetAppointmentDocumentsPayload): Promise<PatientReportDTO[]> {
    const methodPayload = this.parseInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.history.call<GetPatientDocumentsOutput>(
      InetumHistoryServices.LIST_DOCUMENTS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(payload: GetAppointmentDocumentsPayload): GetPatientDocumentsInput {
    const { fmpId, appointmentId, year, month } = payload;
    const defaultYear = DateHelper.toDate('none').year();
    const parsedDate = DateHelper.parseSplitDate('none', year ?? defaultYear, month);
    const granularity = month ? 'month' : 'year';
    const { start, end } = DateHelper.toRange('inetumDate', granularity, parsedDate);
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoInformesPaciente: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        FechaDesde: year ? start : undefined,
        FechaHasta: year ? end : undefined,
        NumRegistros: AppointmentConstants.DEFAULT_REPORT_COUNT,
        CanalEntrada: CRPConstants.ORIGIN,
        IdCita: appointmentId,
      },
    };
  }

  private parseOutput(rawResult: GetPatientDocumentsOutput): PatientReportDTO[] {
    let result = rawResult.ListadoInformesResult?.Informe?.InformeRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const documents: PatientReportDTO[] = result.map((document) => ({
      documentId: document.IdEpisodio,
      episodeId: document.IdActo,
      date: document.Fecha,
      time: document.Hora,
      centerId: document.IdCentro,
      doctor: { name: document.NombreProfesional },
      specialty: { name: document.NombreAgrupacion },
      appointmentType: { name: document.NombrePrestacion },
      type: document.Tipo,
      documentCategory: document.TituloInforme,
    }));

    return documents;
  }
}

export class GetPatientDocumentsRepositoryMock implements IGetPatientDocumentsRepository {
  async execute(): Promise<PatientReportDTO[]> {
    return Promise.resolve([
      {
        documentId: '#b731d7bf-edea-cdce-1da3-08dd0351629c',
        episodeId: 'C24CLIRP37649542',
        date: '20241112',
        time: '14:37',
        centerId: '051010100',
        doctor: { name: 'CESAR OMAR PE' },
        specialty: { name: 'Cardiología' },
        appointmentType: {
          name: 'ELE) CONSULTA PRIMERA (AUTOADMISION POR ADELANTADO, INCLUYE PAGO Y EVITE COLAS) (500101)',
        },
        type: 'C',
        documentCategory: 'INF RECETA',
      },
    ]);
  }
}
