import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentTransactionResultDTO } from 'src/app/entities/dtos/service/appointmentTransactionResult.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { AppointmentConstants } from 'src/general/contants/appointment.constants';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type UpdateAppointmentInput = {
  usuario: string;
  contrasena: string;
  peticionAnularCita: {
    IdPaciente: string;
    IdCentro: string;
    IdCita: string;
    IdMotivo: string;
    FechaCita: string;
    CanalEntrada: string;
  };
};

type UpdateAppointmentOutput = {
  AnularCitaResult: {
    DescripcionError: string;
    CodResultado: number;
  };
};

export interface IUpdateAppointmentRepository {
  execute(fmpId: PatientDM['fmpId'], appointmentId: string, date: string): Promise<AppointmentTransactionResultDTO>;
}

export class UpdateAppointmentRepository implements IUpdateAppointmentRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId'], appointmentId: string, date: string): Promise<AppointmentTransactionResultDTO> {
    const methodPayload = this.generateInput(fmpId, appointmentId, date);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<UpdateAppointmentOutput>('AnularCita', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(fmpId: PatientDM['fmpId'], appointmentId: string, date: string): UpdateAppointmentInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionAnularCita: {
        IdPaciente: fmpId,
        IdCentro: CRPConstants.CENTER_ID,
        IdCita: appointmentId ?? '',
        IdMotivo: AppointmentConstants.REASON_ID,
        FechaCita: DateHelper.toFormatDate(date, 'inetumDate'),   
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: UpdateAppointmentOutput): AppointmentTransactionResultDTO {
    return {
      errorCode: Number(rawResult.AnularCitaResult.CodResultado),
      errorDescription: rawResult.AnularCitaResult.DescripcionError ?? null,
    };
  }
}

export class UpdateAppointmentRepositoryMock implements IUpdateAppointmentRepository {
  async execute(): Promise<AppointmentTransactionResultDTO> {
    return {
      errorCode: 0,
      errorDescription: null
    };
  }
}
