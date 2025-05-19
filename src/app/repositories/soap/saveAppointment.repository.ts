import { AppointmentCreateDTO } from 'src/app/entities/dtos/service/appointmentCreate.dto';
import { AppointmentRequestDTO } from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { SoapConstants } from 'src/general/contants/soap.constants';
import { DateHelper } from 'src/general/helpers/date.helper';

type SaveAppointmentInput = {
  usuario: string;
  contrasena: string;
  peticionAltaCita: {
    IdPaciente: string;
    IdCentro: string;
    CodAgenda: string;
    CodBloque: string;
    TipoPaciente: string;
    IdSociedad: string;
    IdPrestacion: string;
    IdEspecialidad: string;
    IdProfesional: string;
    Motivo: string;
    FechaCita: string;
    HoraCita: string;
    CodInspeccion: string;
    CanalEntrada: string;
  };
};

type SaveAppointmentOutput = {
  AltaCitaResult: {
    IdCita?: string | null;
    DescripcionError: string;
    CodResultado: number;
  };
};

export interface ISaveAppointmentRepository {
  execute(payload: AppointmentRequestDTO): Promise<AppointmentCreateDTO>;
}

export class SaveAppointmentRepository implements ISaveAppointmentRepository {
  private readonly user: string = process.env.INETUM_USER ?? '';
  private readonly password: string = process.env.INETUM_PASSWORD ?? '';
  private readonly centerId: string = process.env.CRP_CENTER_ID ?? '';

  async execute(payload: AppointmentRequestDTO): Promise<AppointmentCreateDTO> {
    const methodPayload = this.generateInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<SaveAppointmentOutput>('AltaCita', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(payload: AppointmentRequestDTO): SaveAppointmentInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionAltaCita: {
        IdPaciente: payload.fmpId,
        IdCentro: this.centerId,
        CodAgenda: payload.scheduleId,
        CodBloque: payload.blockId,
        TipoPaciente: SoapConstants.PATIENT_TYPE,
        IdSociedad: payload.insuranceId,
        IdPrestacion: payload.appointmentTypeId,
        IdEspecialidad: payload.specialtyId,
        IdProfesional: payload.doctorId,
        Motivo: SoapConstants.REASON_MESSAGE,
        FechaCita: DateHelper.toFormatDate(payload.date, 'inetumDate'),
        HoraCita: DateHelper.toFormatTime(payload.date, 'inetumTime'),
        CodInspeccion: payload.inspectionId,
        CanalEntrada: SoapConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: SaveAppointmentOutput): AppointmentCreateDTO {
    return {
      id: rawResult.AltaCitaResult?.IdCita ?? null,
      errorCode: Number(rawResult.AltaCitaResult.CodResultado),
    };
  }
}

export class SaveAppointmentRepositoryMock implements ISaveAppointmentRepository {
  async execute(): Promise<AppointmentCreateDTO> {
    return {
      id: 'C202335563796',
      errorCode: 0,
    };
  }
}
