import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDocumentDTO } from 'src/app/entities/dtos/service/appointmentDocument.dto';
import { InetumClient, InetumHistoryServices } from 'src/clients/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetAppointmentDocumentsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoInformesPaciente: {
    IdPaciente: string;
    IdCentro: string;
    FechaDesde?: string;
    FechaHasta?: string;
    HoraDesde?: string;
    HoraHasta?: string;
    NumRegistros: string;
    CanalEntrada: string;
    IdCita: string;
  };
};

type GetAppointmentDocumentsOutput = {
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

export interface IGetAppointmentDocumentsRepository {
  execute(
    fmpId: PatientDM['fmpId'],
    appointmentId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AppointmentDocumentDTO[]>;
}

export class GetAppointmentDocumentsRepository implements IGetAppointmentDocumentsRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(
    fmpId: PatientDM['fmpId'],
    appointmentId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AppointmentDocumentDTO[]> {
    const methodPayload = this.parseInput(fmpId, appointmentId, startDate, endDate);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.history.call<GetAppointmentDocumentsOutput>(
      InetumHistoryServices.LIST_DOCUMENTS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(
    fmpId: PatientDM['fmpId'],
    appointmentId: string,
    startDate?: string,
    endDate?: string,
  ): GetAppointmentDocumentsInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoInformesPaciente: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        FechaDesde: startDate ? DateHelper.toFormatDate(startDate, 'inetumDate') : undefined,
        FechaHasta: endDate ? DateHelper.toFormatDate(endDate, 'inetumDate') : undefined,
        HoraDesde: startDate ? DateHelper.startOfTime('inetumTime') : undefined,
        HoraHasta: endDate ? DateHelper.endOfTime('inetumTime') : undefined,
        NumRegistros: AppointmentConstants.DEFAULT_DOCUMENT_COUNT,
        CanalEntrada: CRPConstants.ORIGIN,
        IdCita: appointmentId,
      },
    };
  }

  private parseOutput(rawResult: GetAppointmentDocumentsOutput): AppointmentDocumentDTO[] {
    let result = rawResult.ListadoInformesResult?.Informe?.InformeRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const documents: AppointmentDocumentDTO[] = result.map((document) => ({
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

export class GetAppointmentDocumentsRepositoryMock implements IGetAppointmentDocumentsRepository {
  async execute(): Promise<AppointmentDocumentDTO[]> {
    return [
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
    ];
  }
}
