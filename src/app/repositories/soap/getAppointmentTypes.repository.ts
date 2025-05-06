import { AppointmentTypeDTO } from 'src/app/entities/dtos/service/appointmentType.dto';
import { InetumClient } from 'src/clients/inetum.client';

type GetAppointmentTypesInput = {
  usuario: string;
  contrasena: string;
  peticionListadoPrestaciones: {
    IdCentro: string;
    CanalEntrada: string;
    IdEspecialidad: string;
    IdProfesional: string;
    IdSociedad?: string;
  };
};

type GetAppointmentTypesOutput = {
  ListadoPrestacionesResult: {
    Prestaciones: {
      Prestacion: {
        IdPrestacion: string;
        Nombre: string;
      }[];
    };
  };
};

export interface IGetAppointmentTypesRepository {
  execute(doctorId: string, specialtyId: string, insuranceId?: string): Promise<AppointmentTypeDTO[]>;
}

export class GetAppointmentTypesRepository implements IGetAppointmentTypesRepository {
  async execute(doctorId: string, specialtyId: string, insuranceId?: string): Promise<AppointmentTypeDTO[]> {
    const methodPayload = this.parseInput(doctorId, specialtyId, insuranceId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetAppointmentTypesOutput>('ListadoPrestaciones', methodPayload);
    return this.parseOutput(rawResult);
  }

  private parseInput(doctorId: string, specialtyId: string, insuranceId?: string): GetAppointmentTypesInput {
    return {
      usuario: process.env.INETUM_USER ?? '',
      contrasena: process.env.INETUM_PASSWORD ?? '',
      peticionListadoPrestaciones: {
        IdCentro: process.env.CRP_CENTER_ID ?? '',
        IdEspecialidad: specialtyId,
        IdProfesional: doctorId,
        IdSociedad: insuranceId,
        CanalEntrada: 'PERU',
      },
    };
  }

  private parseOutput(rawResult: GetAppointmentTypesOutput): AppointmentTypeDTO[] {
    const appointmentTypes: AppointmentTypeDTO[] =
      rawResult.ListadoPrestacionesResult?.Prestaciones?.Prestacion?.map((type) => ({
        id: String(type.IdPrestacion),
        name: type.Nombre,
      })) || [];

    return appointmentTypes;
  }
}

export class GetAppointmentTypesRepositoryMock implements IGetAppointmentTypesRepository {
  async execute(): Promise<AppointmentTypeDTO[]> {
    return [
      {
        id: '3300-10010942',
        name: '(ONC) CONSULTA NO PRESENCIAL (VIDEOCONFERENCIA) (ONCOLOGÍA MÉDICA) (500101) (ONCOLOGÍA MÉDICA)',
      },
    ];
  }
}
