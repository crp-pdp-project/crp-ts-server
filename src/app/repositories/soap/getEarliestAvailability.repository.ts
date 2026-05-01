import type { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { InetumAppointmentServices, InetumClient } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetEarliestAvailabilityInput = {
  usuario: string;
  contrasena: string;
  peticionListadoHuecosDisponibles: {
    IdCentro: string;
    IdAgrupacion: string;
    IdPrestacion: string;
    IdSociedad: string;
    FechaDesde: string;
    CodInspeccion: string;
    HoraDesde: string;
    CanalEntrada: string;
    CantidadHuecos: string;
  };
};

type GetEarliestAvailabilityOutput = {
  CitasMasProximasPorEspecialidadResult: {
    Profesionales: {
      Profesional: {
        IdProfesional: string;
        NombresProfesional: string;
        Huecos: {
          HuecoDisponible: {
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
      }[];
    };
  };
};

export type EarliestAvailabilityRequest = {
  groupId: string;
  appointmentTypeId: string;
  insuranceId: string;
  inspectionId: string;
  filterDate?: string;
};

export interface IGetEarliestAvailabilityRepository {
  execute(payload: EarliestAvailabilityRequest): Promise<DoctorDTO[]>;
}

export class GetEarliestAvailabilityRepository implements IGetEarliestAvailabilityRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(payload: EarliestAvailabilityRequest): Promise<DoctorDTO[]> {
    const methodPayload = this.generateInput(payload);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.appointment.call<GetEarliestAvailabilityOutput>(
      InetumAppointmentServices.GET_EARLIEST_AVAILABILITY,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(payload: EarliestAvailabilityRequest): GetEarliestAvailabilityInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoHuecosDisponibles: {
        IdCentro: CRPConstants.CENTER_ID,
        IdAgrupacion: payload.groupId,
        IdPrestacion: payload.appointmentTypeId,
        IdSociedad: payload.insuranceId,
        FechaDesde: DateHelper.toDate('inetumDate', payload.filterDate),
        CodInspeccion: payload.inspectionId,
        HoraDesde: DateHelper.startOf('inetumTime', 'day'),
        CanalEntrada: CRPConstants.ORIGIN,
        CantidadHuecos: String(CRPConstants.EARLIEST_SLOT_LIMIT),
      },
    };
  }

  private parseOutput(rawResult: GetEarliestAvailabilityOutput): DoctorDTO[] {
    let result = rawResult.CitasMasProximasPorEspecialidadResult?.Profesionales?.Profesional ?? [];
    result = Array.isArray(result) ? result : [result];

    const doctors: DoctorDTO[] = result.map((professional) => {
      let slots = professional?.Huecos?.HuecoDisponible ?? [];
      slots = Array.isArray(slots) ? slots : [slots];

      return {
        id: String(professional.IdProfesional),
        name: professional.NombresProfesional ?? '',
        availability: slots.map((availability) => ({
          specialtyId: String(availability.IdEspecialidad),
          doctorId: String(availability.IdProfesional),
          appointmentTypeId: String(availability.IdPrestacion),
          scheduleId: String(availability.CodAgenda),
          blockId: String(availability.CodBloque),
          date: String(availability.FechaCita),
          time: String(availability.HoraCita),
        })),
      };
    });

    return doctors;
  }
}

export class GetEarliestAvailabilityRepositoryMock implements IGetEarliestAvailabilityRepository {
  async execute(): Promise<DoctorDTO[]> {
    return Promise.resolve([
      {
        id: '70358611',
        name: 'MARÍA DEL CARMEN PA JA',
        availability: [
          {
            specialtyId: '900',
            doctorId: '44789755',
            appointmentTypeId: '900-10010020',
            scheduleId: 'CRP_CardFC',
            blockId: 'Tar: __XJ__ (Mar-Dic25)',
            date: '20250508',
            time: '150000',
          },
        ],
      },
    ]);
  }
}
