import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { DateHelper } from 'src/general/helpers/date.helper';

type GetCurrentAppointmentsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoCitas: {
    IdCentro: string;
    CanalEntrada: string;
    IdPaciente: string;
    FechaInicio?: string;
    FechaFinal?: string;
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
  execute(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]>;
}

export class GetCurrentAppointmentsRepository implements IGetCurrentAppointmentsRepository {
  private readonly monthsToList = Number(process.env.CURRENT_MONTHS_LIST ?? 6);

  async execute(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]> {
    const methodPayload = this.generateInput(fmpId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetCurrentAppointmentsOutput>('ListadoCitas', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(fmpId: PatientDM['fmpId']): GetCurrentAppointmentsInput {
    return {
      usuario: process.env.INETUM_USER ?? '',
      contrasena: process.env.INETUM_PASSWORD ?? '',
      peticionListadoCitas: {
        IdPaciente: fmpId,
        IdCentro: process.env.CRP_CENTER_ID ?? '',
        CanalEntrada: 'PERU',
        FechaInicio: DateHelper.dateNow('inetumDate'),
        FechaFinal: DateHelper.addMonths(this.monthsToList, 'inetumDate'),
      },
    };
  }

  private parseOutput(rawResult: GetCurrentAppointmentsOutput): AppointmentDTO[] {
    const appointments: AppointmentDTO[] =
      rawResult.ListadoCitasResult?.Citas?.CitaRespuesta?.map((appointment) => ({
        id: String(appointment.IdCita),
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
          id: String(appointment.IdPrestacion),
          name: appointment.Prestacion ?? '',
        },
        insurance: {
          id: String(appointment.IdSociedad),
          inspectionId: String(appointment.CodInspeccion),
        },
        canCancel: appointment.PuedeAnular === 'S',
        canReprogram: appointment.PuedeModificar === 'S',
        didShow: appointment.Presentado === 'true',
      })) || [];

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
        canCancel: false,
        canReprogram: false,
        didShow: true,
      },
    ];
  }
}
