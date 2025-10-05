import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDTO } from 'src/app/entities/dtos/service/appointment.dto';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

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
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId']): Promise<AppointmentDTO[]> {
    const methodPayload = this.generateInput(fmpId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetHistoricAppointmentsOutput>(
      InetumAppointmentServices.LIST_HISTORIC_APPOINTMENTS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(fmpId: PatientDM['fmpId']): GetHistoricAppointmentsInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoConsultas: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        CanalEntrada: CRPConstants.ORIGIN,
        FechaInicio: DateHelper.subtractMonths(AppointmentConstants.HISTORIC_MONTHS_LIST, 'inetumDate'),
        FechaFinal: DateHelper.dateNow('inetumDate'),
      },
    };
  }

  private parseOutput(rawResult: GetHistoricAppointmentsOutput): AppointmentDTO[] {
    let result = rawResult.ListadoConsultasResult.Consultas?.ConsultaRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const appointments: AppointmentDTO[] = result.map((appointment) => ({
      id: TextHelper.normalizeAppointmentId(String(appointment.IdConsulta)),
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
