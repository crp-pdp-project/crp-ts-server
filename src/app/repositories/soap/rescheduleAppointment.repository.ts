import { AppointmentRequestDTO } from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { AppointmentTransactionResultDTO } from 'src/app/entities/dtos/service/appointmentTransactionResult.dto';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type RescheduleAppointmentInput = {
  usuario: string;
  contrasena: string;
  peticionModificarCita: {
    IdCentro: string;
    IdCitaAntigua: string;
    CodAgenda: string;
    CodBloque: string;
    IdPrestacion: string;
    IdEspecialidad: string;
    IdProfesional: string;
    FechaNuevaCita: string;
    HoraNuevaCita: string;
    IdPaciente: string;
    CanalEntrada: string;
  };
};

type RescheduleAppointmentOutput = {
  ModificarCitaResult: {
    IdCita?: string | null;
    DescripcionError: string;
    CodResultado: number;
  };
};

export interface IRescheduleAppointmentRepository {
  execute(payload: AppointmentRequestDTO): Promise<AppointmentTransactionResultDTO>;
}

export class RescheduleAppointmentRepository implements IRescheduleAppointmentRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(payload: AppointmentRequestDTO): Promise<AppointmentTransactionResultDTO> {
    const methodPayload = this.generateInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<RescheduleAppointmentOutput>(
      InetumAppointmentServices.RESCHEDULE_APPOINTMENT,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(payload: AppointmentRequestDTO): RescheduleAppointmentInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionModificarCita: {
        IdCentro: CRPConstants.CENTER_ID,
        IdCitaAntigua: payload.appointmentId ?? '',
        CodAgenda: payload.scheduleId,
        CodBloque: payload.blockId,
        IdPrestacion: payload.appointmentTypeId,
        IdEspecialidad: payload.specialtyId,
        IdProfesional: payload.doctorId,
        FechaNuevaCita: DateHelper.toFormatDate(payload.date, 'inetumDate'),
        HoraNuevaCita: DateHelper.toFormatTime(payload.date, 'inetumTime'),
        IdPaciente: payload.fmpId,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: RescheduleAppointmentOutput): AppointmentTransactionResultDTO {
    return {
      id: rawResult.ModificarCitaResult?.IdCita ?? undefined,
      errorCode: Number(rawResult.ModificarCitaResult.CodResultado),
      errorDescription: rawResult.ModificarCitaResult.DescripcionError ?? null,
    };
  }
}

export class RescheduleAppointmentRepositoryMock implements IRescheduleAppointmentRepository {
  async execute(): Promise<AppointmentTransactionResultDTO> {
    return {
      id: 'C202335563796',
      errorCode: 0,
      errorDescription: null,
    };
  }
}
