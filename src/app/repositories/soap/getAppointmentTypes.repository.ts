import { AppointmentTypeDTO } from 'src/app/entities/dtos/service/appointmentType.dto';
import { InetumCatalogServices, InetumClient } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

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
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(doctorId: string, specialtyId: string, insuranceId?: string): Promise<AppointmentTypeDTO[]> {
    const methodPayload = this.parseInput(doctorId, specialtyId, insuranceId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetAppointmentTypesOutput>(
      InetumCatalogServices.LIST_APPOINTMENT_TYPES,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(doctorId: string, specialtyId: string, insuranceId?: string): GetAppointmentTypesInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoPrestaciones: {
        IdCentro: CRPConstants.CENTER_ID,
        IdEspecialidad: specialtyId,
        IdProfesional: doctorId,
        IdSociedad: insuranceId,
        CanalEntrada: 'PERU',
      },
    };
  }

  private parseOutput(rawResult: GetAppointmentTypesOutput): AppointmentTypeDTO[] {
    let result = rawResult.ListadoPrestacionesResult?.Prestaciones?.Prestacion ?? [];
    result = Array.isArray(result) ? result : [result];

    const appointmentTypes: AppointmentTypeDTO[] = result.map((type) => ({
      id: String(type.IdPrestacion),
      name: type.Nombre,
    }));

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
