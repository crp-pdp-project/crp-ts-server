import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { InetumCatalogServices, InetumClient } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetDoctorsInput = {
  usuario: string;
  contrasena: string;
  peticionListadoProfesionales: {
    IdCentro: string;
    CanalEntrada: string;
    IdEspecialidad?: string;
  };
};

type GetDoctorsOutput = {
  ListadoProfesionalesResult: {
    Profesionales: {
      Profesional: {
        DniProfesional: string;
        Nombre: string;
        IdEspecialidad: string;
        DescEspecialidad: string;
      }[];
    };
  };
};

export interface IGetDoctorsRepository {
  execute(specialtyId?: string): Promise<DoctorDTO[]>;
}

export class GetDoctorsRepository implements IGetDoctorsRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(specialtyId?: string): Promise<DoctorDTO[]> {
    const methodPayload = this.parseInput(specialtyId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetDoctorsOutput>(InetumCatalogServices.LIST_DOCTORS, methodPayload);
    return this.parseOutput(rawResult);
  }

  private parseInput(specialtyId?: string): GetDoctorsInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoProfesionales: {
        IdCentro: CRPConstants.CENTER_ID,
        IdEspecialidad: specialtyId,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: GetDoctorsOutput): DoctorDTO[] {
    let result = rawResult.ListadoProfesionalesResult?.Profesionales?.Profesional ?? [];
    result = Array.isArray(result) ? result : [result];

    const doctors: DoctorDTO[] = result.map((professional) => ({
      id: String(professional.DniProfesional),
      name: professional.Nombre ?? '',
      specialty: {
        id: String(professional.IdEspecialidad),
        groupId: String(professional.IdEspecialidad).slice(0, -2) || '0',
        name: professional.DescEspecialidad ?? '',
      },
    }));

    return doctors;
  }
}

export class GetDoctorsRepositoryMock implements IGetDoctorsRepository {
  async execute(): Promise<DoctorDTO[]> {
    return Promise.resolve([
      {
        id: '70358611',
        name: 'MARÍA DEL CARMEN PA JA',
        specialty: {
          id: '3706',
          name: 'Medicina Física y Rehabilitación',
        },
      },
    ]);
  }
}
