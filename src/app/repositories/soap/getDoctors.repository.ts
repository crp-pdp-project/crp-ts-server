import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { InetumClient } from 'src/clients/inetum.client';

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
  async execute(specialtyId?: string): Promise<DoctorDTO[]> {
    const methodPayload = this.parseInput(specialtyId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetDoctorsOutput>('ListadoProfesionales', methodPayload);
    return this.parseOutput(rawResult);
  }

  private parseInput(specialtyId?: string): GetDoctorsInput {
    return {
      usuario: process.env.INETUM_USER ?? '',
      contrasena: process.env.INETUM_PASSWORD ?? '',
      peticionListadoProfesionales: {
        IdEspecialidad: specialtyId,
        IdCentro: process.env.CRP_CENTER_ID ?? '',
        CanalEntrada: 'PERU',
      },
    };
  }

  private parseOutput(rawResult: GetDoctorsOutput): DoctorDTO[] {
    const professionals: DoctorDTO[] =
      rawResult.ListadoProfesionalesResult?.Profesionales?.Profesional?.map((professional) => ({
        id: String(professional.DniProfesional),
        name: professional.Nombre ?? '',
        specialty: {
          id: String(professional.IdEspecialidad),
          name: professional.DescEspecialidad ?? '',
        },
      })) || [];

    return professionals;
  }
}

export class GetDoctorsRepositoryMock implements IGetDoctorsRepository {
  async execute(): Promise<DoctorDTO[]> {
    return [
      {
        id: '70358611',
        name: 'MARÍA DEL CARMEN PA JA',
        specialty: {
          id: '3706',
          name: 'Medicina Física y Rehabilitación',
        },
      },
    ];
  }
}
