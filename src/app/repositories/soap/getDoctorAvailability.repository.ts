import { AvailabilityRequestDTO } from 'src/app/entities/dtos/service/availabilityRequest.dto';
import { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetDoctorAvailabilityInput = {
  usuario: string;
  contrasena: string;
  peticionListadoHuecosDisponibles: {
    IdCentro: string;
    IdEspecialidad: string;
    IdProfesional: string;
    IdPrestacion: string;
    IdSociedad: string;
    FechaDesde: string;
    CodInspeccion: string;
    FechaFin: string;
    HoraDesde: string;
    HoraFin: string;
    IdPaciente: string;
    CanalEntrada: string;
    PrimerHueco?: string;
  };
};

type GetDoctorAvailabilityOutput = {
  ListadoHuecosDisponiblesResult: {
    Huecos: {
      Hueco: {
        IdCentro: string;
        IdEspecialidad: string;
        IdProfesional: string;
        IdPrestacion: string;
        CodAgenda: string;
        CodBloque: string;
        FechaCita: string;
        HoraCita: string;
      }[];
    };
  };
};

export interface IGetDoctorAvailabilityRepository {
  execute(payload: AvailabilityRequestDTO): Promise<DoctorAvailabilityDTO[]>;
}

export class GetDoctorAvailabilityRepository implements IGetDoctorAvailabilityRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(payload: AvailabilityRequestDTO): Promise<DoctorAvailabilityDTO[]> {
    const methodPayload = this.generateInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetDoctorAvailabilityOutput>(
      InetumAppointmentServices.GET_DOCTOR_AVAILABILITY,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(payload: AvailabilityRequestDTO): GetDoctorAvailabilityInput {
    const initDate = DateHelper.subtractDays(1, 'inetumDate');
    const baseEndDate = DateHelper.addMonths(6, 'inetumDate');

    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoHuecosDisponibles: {
        IdCentro: CRPConstants.CENTER_ID,
        IdEspecialidad: payload.groupId,
        IdProfesional: payload.doctorId,
        IdPrestacion: payload.appointmentTypeId,
        IdSociedad: payload.insuranceId,
        FechaDesde: initDate,
        CodInspeccion: payload.inspectionId,
        FechaFin: DateHelper.addDays(1, 'inetumDate', baseEndDate),
        HoraDesde: DateHelper.startOfTime('inetumTime'),
        HoraFin: DateHelper.endOfTime('inetumTime'),
        IdPaciente: payload.fmpId,
        CanalEntrada: CRPConstants.ORIGIN,
        PrimerHueco: String(payload.firstAvailable),
      },
    };
  }

  private parseOutput(rawResult: GetDoctorAvailabilityOutput): DoctorAvailabilityDTO[] {
    let result = rawResult.ListadoHuecosDisponiblesResult?.Huecos?.Hueco ?? [];
    result = Array.isArray(result) ? result : [result];

    const availability: DoctorAvailabilityDTO[] = result.map((availability) => ({
      specialtyId: String(availability.IdEspecialidad),
      doctorId: String(availability.IdProfesional),
      appointmentTypeId: String(availability.IdPrestacion),
      scheduleId: String(availability.CodAgenda),
      blockId: String(availability.CodBloque),
      date: String(availability.FechaCita),
      time: String(availability.HoraCita),
    }));

    return availability;
  }
}

export class GetDoctorAvailabilityRepositoryMock implements IGetDoctorAvailabilityRepository {
  async execute(): Promise<DoctorAvailabilityDTO[]> {
    return [
      {
        specialtyId: '900',
        doctorId: '44789755',
        appointmentTypeId: '900-10010020',
        scheduleId: 'CRP_CardFC',
        blockId: 'Tar: __XJ__ (Mar-Dic25)',
        date: '20250508',
        time: '150000',
      },
    ];
  }
}
