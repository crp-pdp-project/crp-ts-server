import { AppointmentRequestDTO } from 'src/app/entities/dtos/service/appointmentRequest.dto';
import { AppointmentTransactionResultDTO } from 'src/app/entities/dtos/service/appointmentTransactionResult.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { TextHelper } from 'src/general/helpers/text.helper';

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
  execute(payload: AppointmentRequestDTO): Promise<AppointmentTransactionResultDTO>;
}

export class SaveAppointmentRepository implements ISaveAppointmentRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(payload: AppointmentRequestDTO): Promise<AppointmentTransactionResultDTO> {
    const methodPayload = this.generateInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<SaveAppointmentOutput>(
      InetumAppointmentServices.CREATE_APPOINTMENT,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(payload: AppointmentRequestDTO): SaveAppointmentInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionAltaCita: {
        IdPaciente: payload.fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        CodAgenda: payload.scheduleId,
        CodBloque: payload.blockId,
        TipoPaciente: CRPConstants.DEFAULT_PATIENT_TYPE,
        IdSociedad: payload.insuranceId ?? '',
        IdPrestacion: payload.appointmentTypeId,
        IdEspecialidad: payload.specialtyId,
        IdProfesional: payload.doctorId,
        Motivo: AppointmentConstants.CREATE_REASON,
        FechaCita: DateHelper.toFormatDate(payload.date, 'inetumDate'),
        HoraCita: DateHelper.toFormatTime(payload.date, 'inetumTime'),
        CodInspeccion: payload.inspectionId ?? '',
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: SaveAppointmentOutput): AppointmentTransactionResultDTO {
    const { AltaCitaResult } = rawResult;
    const parsedBody = {
      id: AltaCitaResult?.IdCita ? TextHelper.normalizeAppointmentId(AltaCitaResult.IdCita) : undefined,
      errorCode: Number(AltaCitaResult?.CodResultado ?? 0),
      errorDescription: AltaCitaResult?.DescripcionError ?? null,
    };

    if (parsedBody.errorCode === -1) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.APPOINTMENT_REPEATED });
    }

    if (!parsedBody.id) {
      throw ErrorModel.server({ message: 'Error creating the appointment, no Id received' });
    }

    return parsedBody;
  }
}

export class SaveAppointmentRepositoryMock implements ISaveAppointmentRepository {
  async execute(): Promise<AppointmentTransactionResultDTO> {
    return Promise.resolve({
      id: 'C202335563796',
      errorCode: 0,
      errorDescription: null,
    });
  }
}
