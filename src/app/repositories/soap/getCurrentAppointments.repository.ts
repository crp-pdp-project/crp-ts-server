import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { AppointmentFilters } from 'src/general/enums/appointmentFilters.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

type GetCurrentAppointmentsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoCitas: {
    IdCentro: string;
    CanalEntrada: string;
    IdPaciente: string;
    FechaInicio: string;
    FechaFinal: string;
    EstadoHIS: string;
  };
};

type GetCurrentAppointmentsOutput = {
  ListadoCitasResult: {
    Citas: {
      CitaRespuesta: {
        IdCita: string;
        CodEpisodio: string;
        Fecha: string;
        FechaMaxima: string;
        Hora: string;
        HoraDeFechaMaxima: string;
        IdEspecialidad: string;
        IdAgrupacion: string;
        Especialidad: string;
        IdProfesional: string;
        NombreProfesional: string;
        IdPrestacion: string;
        Prestacion: string;
        IdSociedad: string;
        CodInspeccion: string;
        PuedeAnular: string;
        PuedeModificar: string;
        EstadoHis: string;
        Presentado: string;
      }[];
    };
  };
};

export interface IGetCurrentAppointmentsRepository {
  execute(fmpId: PatientDM['fmpId'], filter: AppointmentFilters, searchDate?: string): Promise<AppointmentDTO[]>;
}

export class GetCurrentAppointmentsRepository implements IGetCurrentAppointmentsRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId'], filter: AppointmentFilters, searchDate?: string): Promise<AppointmentDTO[]> {
    const methodPayload = this.generateInput(fmpId, filter, searchDate);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetCurrentAppointmentsOutput>(
      InetumAppointmentServices.LIST_CURRENT_APPOINTMENTS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(
    fmpId: PatientDM['fmpId'],
    filter: AppointmentFilters,
    searchDate?: string,
  ): GetCurrentAppointmentsInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoCitas: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        CanalEntrada: CRPConstants.ORIGIN,
        FechaInicio: searchDate
          ? DateHelper.subtractDays(1, 'inetumDate', searchDate)
          : DateHelper.dateNow('inetumDate'),
        FechaFinal: searchDate
          ? DateHelper.addDays(1, 'inetumDate', searchDate)
          : DateHelper.addMonths(AppointmentConstants.CURRENT_MONTHS_LIST, 'inetumDate'),
        EstadoHIS: filter,
      },
    };
  }

  private parseOutput(rawResult: GetCurrentAppointmentsOutput): AppointmentDTO[] {
    let result = rawResult.ListadoCitasResult?.Citas?.CitaRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const appointments: AppointmentDTO[] = result.map((appointment) => ({
      id: TextHelper.normalizeAppointmentId(String(appointment.IdCita)),
      episodeId: String(appointment.CodEpisodio),
      date: `${appointment.Fecha}${appointment.Hora}`,
      status: appointment.EstadoHis,
      doctor: {
        id: String(appointment.IdProfesional),
        name: appointment.NombreProfesional ?? '',
      },
      specialty: {
        id: String(appointment.IdEspecialidad),
        groupId: String(appointment.IdAgrupacion),
        name: appointment.Especialidad ?? '',
      },
      appointmentType: {
        id: TextHelper.normalizeAppointmentTypeId(String(appointment.IdPrestacion), String(appointment.IdEspecialidad)),
        name: appointment.Prestacion ?? '',
      },
      insurance: {
        id: String(appointment.IdSociedad),
        inspectionId: String(appointment.CodInspeccion),
      },
    }));

    return appointments;
  }
}

export class GetCurrentAppointmentsRepositoryMock implements IGetCurrentAppointmentsRepository {
  async execute(): Promise<AppointmentDTO[]> {
    return [
      {
        id: 'C202336100432',
        episodeId: 'C23CLIRP36100432',
        date: '20231019163000',
        status: 'Citado',
        doctor: {
          id: '42512121',
          name: 'ELIZABETH ZE',
        },
        specialty: {
          id: '7800',
          groupId: '78',
          name: 'Nutricion general',
        },
        appointmentType: {
          id: '7800-20000315',
          name: '(NTR) CONSULTA PRIMERA (NUTRICION GENERAL) (520101)',
        },
        insurance: {
          id: '16725',
          inspectionId: '99',
        },
      },
    ];
  }
}
