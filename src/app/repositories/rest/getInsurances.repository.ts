import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type GetInsurancesOutput = {
  data: {
    iseg_id: string;
    vseg_nombre: string;
    cod_inspeccion: string;
    tipo: string;
    codigoIAFA: string;
    codigoFAS: string;
  }[];
  esCorrecto: boolean;
};

export interface IGetInsurancesRepository {
  execute(): Promise<InsuranceDTO[]>;
}

export class GetInsurancesRepository implements IGetInsurancesRepository {
  private readonly crp = CRPClient.instance;

  async execute(): Promise<InsuranceDTO[]> {
    const rawResult = await this.crp.call<GetInsurancesOutput>({
      method: HttpMethod.GET,
      path: CRPServicePaths.LIST_INSURANCES,
    });
    return this.parseOutput(rawResult);
  }

  private parseOutput(rawResult: GetInsurancesOutput): InsuranceDTO[] {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ message: 'Did not found any insurances' });
    }

    const insurances: InsuranceDTO[] =
      data.map((insurance) => ({
        id: String(insurance.iseg_id),
        inspectionId: String(insurance.cod_inspeccion),
        iafaId: String(insurance.codigoIAFA),
        fasId: String(insurance.codigoFAS),
        name: insurance.vseg_nombre,
        type: insurance.tipo,
      })) || [];

    return insurances;
  }
}

export class GetInsurancesRepositoryMock implements IGetInsurancesRepository {
  async execute(): Promise<InsuranceDTO[]> {
    return Promise.resolve([
      {
        id: '16004',
        name: 'LA POSITIVA SEGUROS Y REASEGUROS',
        inspectionId: '99',
        type: 'SITEDS',
        iafaId: '40005',
        fasId: '00041488',
      },
    ]);
  }
}
