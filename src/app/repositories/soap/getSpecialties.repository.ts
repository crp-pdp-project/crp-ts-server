import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

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
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(): Promise<SpecialtyDTO[]> {
    const methodPayload = this.generateInput();
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetSpecialtiesOutput>('ListadoEspecialidades', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(): GetSpecialtiesInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoEspecialidades: {
        IdCentro: CRPConstants.CENTER_ID,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: GetSpecialtiesOutput): SpecialtyDTO[] {
    const specialties: SpecialtyDTO[] =
      rawResult.ListadoEspecialidadesResult?.Especialidades?.Especialidad?.map((specialty) => ({
        id: String(specialty.IdEspecialidad),
        groupId: String(specialty.IdEspecialidad).slice(0, -2) || '0',
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
