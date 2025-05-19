import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { InetumClient } from 'src/clients/inetum.client';
import { SoapConstants } from 'src/general/contants/soap.constants';

type GetInsurancesInput = {
  usuario: string;
  contrasena: string;
  peticionListadoSociedades: {
    IdCentro: string;
    CanalEntrada: string;
  };
};

type GetInsurancesOutput = {
  ListadoSociedadesResult: {
    Sociedades: {
      SociedadRespuesta: {
        IdSociedad: string;
        CodInspeccion: string;
        Nombre: string;
      }[];
    };
  };
};

export interface IGetInsurancesRepository {
  execute(): Promise<InsuranceDTO[]>;
}

export class GetInsurancesRepository implements IGetInsurancesRepository {
  private readonly user: string = process.env.INETUM_USER ?? '';
  private readonly password: string = process.env.INETUM_PASSWORD ?? '';
  private readonly centerId: string = process.env.CRP_CENTER_ID ?? '';

  async execute(): Promise<InsuranceDTO[]> {
    const methodPayload = this.generateInput();
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.catalog.call<GetInsurancesOutput>('ListadoSociedades', methodPayload);
    return this.parseOutput(rawResult);
  }

  private generateInput(): GetInsurancesInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionListadoSociedades: {
        IdCentro: this.centerId,
        CanalEntrada: SoapConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: GetInsurancesOutput): InsuranceDTO[] {
    const insurances: InsuranceDTO[] =
      rawResult.ListadoSociedadesResult?.Sociedades?.SociedadRespuesta?.map((insurance) => ({
        id: String(insurance.IdSociedad),
        inspectionId: String(insurance.CodInspeccion),
        name: insurance.Nombre,
      })) || [];

    return insurances;
  }
}

export class GetInsurancesRepositoryMock implements IGetInsurancesRepository {
  async execute(): Promise<InsuranceDTO[]> {
    return [
      {
        id: '16260',
        inspectionId: '99',
        name: '24DR',
      },
    ];
  }
}
