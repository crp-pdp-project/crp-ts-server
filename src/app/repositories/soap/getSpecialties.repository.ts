import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { InetumClient } from 'src/clients/inetum.client';

type GetSpecialtiesInput = {
  usuario: string;
  contrasena: string;
  peticionListadoEspecialidades: {
    IdCentro: string;
    CanalEntrada: string;
  };
};

type GetSpecialtiesOutput = {
  ListadoEspecialidadesResult: {
    Especialidades: {
      Especialidad: {
        IdEspecialidad: string;
        Nombre: string;
      }[];
    };
  };
};

export interface IGetSpecialtiesRepository {
  execute(): Promise<SpecialtyDTO[]>;
}

export class GetSpecialtiesRepository implements IGetSpecialtiesRepository {
  async execute(): Promise<SpecialtyDTO[]> {
    const methodPayload = this.generateInput();
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetSpecialtiesOutput>('ListadoEspecialidades', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(): GetSpecialtiesInput {
    return {
      usuario: process.env.INETUM_USER ?? '',
      contrasena: process.env.INETUM_PASSWORD ?? '',
      peticionListadoEspecialidades: {
        IdCentro: process.env.CRP_CENTER_ID ?? '',
        CanalEntrada: 'PERU',
      },
    };
  }

  private parseOutput(rawResult: GetSpecialtiesOutput): SpecialtyDTO[] {
    const specialties: SpecialtyDTO[] =
      rawResult.ListadoEspecialidadesResult?.Especialidades?.Especialidad?.map((specialty) => ({
        id: String(specialty.IdEspecialidad),
        name: specialty.Nombre,
      })) || [];

    return specialties;
  }
}

export class GetSpecialtiesRepositoryMock implements IGetSpecialtiesRepository {
  async execute(): Promise<SpecialtyDTO[]> {
    return [
      {
        id: '3706',
        name: 'Medicina Física y Rehabilitación',
      },
    ];
  }
}
