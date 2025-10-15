import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientResultDTO } from 'src/app/entities/dtos/service/patientResult.dto';
import { InetumClient, InetumHistoryServices } from 'src/clients/inetum/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ResultConstants } from 'src/general/contants/result.constants';
import { DateHelper, Months } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetPatientResultsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoPruebasDiagnosticas: {
    IdPaciente: string;
    IdCentro: string;
    TipoPrueba: string;
    FechaInicio: string;
    FechaFin: string;
    NumRegistros: string;
    CanalEntrada: string;
  };
};

type GetPatientResultsOutput = {
  ListadoPruebasDiagnosticasResult: {
    Prueba: {
      PruebasDiagnosticaRespuesta: {
        IdEpisodio: string;
        Fecha: string;
        Hora: string;
        IdCentro: string;
        TipoPrueba: string;
        NombrePrestacion: string;
        NombreAgrupacion: string;
        NombreProfesional: string;
        EsImagen: string;
        TieneInforme: string;
        EsDefinitivo: string;
        Nhc: string;
        Gidenpac: string;
        Accesnumber: string;
        idSociedad: string;
        IdInforme: string;
        IdActo: string;
      }[];
    };
  };
};

export interface IGetPatientResultsRepository {
  execute(fmpId: PatientDM['fmpId'], year: number, month?: Months): Promise<PatientResultDTO[]>;
}

export class GetPatientResultsRepository implements IGetPatientResultsRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId'], year: number, month?: Months): Promise<PatientResultDTO[]> {
    const methodPayload = this.parseInput(fmpId, year, month);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.history.call<GetPatientResultsOutput>(
      InetumHistoryServices.LIST_RESULTS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(fmpId: PatientDM['fmpId'], year: number, month?: Months): GetPatientResultsInput {
    const { startDate, endDate } = DateHelper.dateRange(year, 'inetumDate', month);
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoPruebasDiagnosticas: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        TipoPrueba: ResultConstants.DEFAULT_RESULT_TYPE,
        FechaInicio: startDate,
        FechaFin: endDate,
        NumRegistros: AppointmentConstants.DEFAULT_DOCUMENT_COUNT,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: GetPatientResultsOutput): PatientResultDTO[] {
    let result = rawResult.ListadoPruebasDiagnosticasResult?.Prueba?.PruebasDiagnosticaRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const results: PatientResultDTO[] = result.map((result) => ({
      resultId: result.IdEpisodio,
      episodeId: result.IdActo,
      date: `${DateHelper.toFormatDate(result.Fecha, 'inetumDate')}${DateHelper.toFormatTime(result.Hora, 'inetumTime')}`,
      centerId: result.IdCentro,
      doctor: { name: result.NombreProfesional },
      specialty: { name: result.NombreAgrupacion },
      appointmentType: { name: result.NombrePrestacion },
      type: result.TipoPrueba,
      accessNumber: result.Accesnumber,
      gidenpac: result.Gidenpac,
    }));

    return results;
  }
}

export class GetPatientResultsRepositoryMock implements IGetPatientResultsRepository {
  async execute(): Promise<PatientResultDTO[]> {
    return Promise.resolve([
      {
        resultId: 'C24CLIRP377628032025031308200010041633|40504165',
        episodeId: 'C24CLIRP37649542',
        date: '20241112143700',
        centerId: '051010100',
        doctor: { name: 'CESAR OMAR PE' },
        specialty: { name: 'Cardiología' },
        appointmentType: {
          name: 'ECOGRAFIA DE PARTES BLANDAS - HOMBRO (250801)',
        },
        type: 'L',
        accessNumber: 'CLIRPC2437762803',
        gidenpac: '733480',
      },
    ]);
  }
}
