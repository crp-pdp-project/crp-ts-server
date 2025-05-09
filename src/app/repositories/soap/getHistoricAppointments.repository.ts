import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { DateHelper } from 'src/general/helpers/date.helper';

type GetHistoricAppointmentsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoConsultas: {
    IdCentro: string;
    CanalEntrada: string;
    IdPaciente: string;
    FechaInicio?: string;
    FechaFinal?: string;
  };
};

type GetHistoricAppointmentsOutput = {
  ListadoConsultasResult: {
    Consultas: {
      ConsultaRespuesta: {
        IdConsulta: string;
        Fecha: string;
        Hora: string;
        IdEspecialidad: string;
        IdAgrupacion: string;
        Especialidad: string;
        IdProfesional: string;
        NombreProfesional: string;
        IdPrestacion: string;
        Prestacion: string;
        IdSociedad: string;
        CodInspeccion: string;
        Estado: string;
      }[];
    };
  };
};

export interface IGetHistoricAppointmentsRepository {
  execute(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]>;
}

export class GetHistoricAppointmentsRepository implements IGetHistoricAppointmentsRepository {
  private readonly monthsToList = Number(process.env.HISTORIC_MONTHS_LIST ?? 6);

  async execute(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]> {
    const methodPayload = this.generateInput(fmpId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetHistoricAppointmentsOutput>('ListadoConsultas', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(fmpId: PatientDM['fmpId']): GetHistoricAppointmentsInput {
    return {
      usuario: process.env.INETUM_USER ?? '',
      contrasena: process.env.INETUM_PASSWORD ?? '',
      peticionListadoConsultas: {
        IdPaciente: fmpId,
        IdCentro: process.env.CRP_CENTER_ID ?? '',
        CanalEntrada: 'PERU',
        FechaInicio: DateHelper.subtractMonths(this.monthsToList, 'inetumDate'),
        FechaFinal: DateHelper.dateNow('inetumDate'),
      },
    };
  }

  private parseOutput(rawResult: GetHistoricAppointmentsOutput): AppointmentDTO[] {
    const appointments: AppointmentDTO[] =
      rawResult.ListadoConsultasResult.Consultas?.ConsultaRespuesta?.map((appointment) => ({
        id: String(appointment.IdConsulta),
        date: `${appointment.Fecha}${appointment.Hora}`,
        status: appointment.Estado,
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
      })) || [];

    return appointments;
  }
}

export class GetHistoricAppointmentsRepositoryMock implements IGetHistoricAppointmentsRepository {
  async execute(): Promise<AppointmentDTO[]> {
    return [
      {
        id: 'C202336100432',
        date: '20231019163000',
        status: 'Cerrado',
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
