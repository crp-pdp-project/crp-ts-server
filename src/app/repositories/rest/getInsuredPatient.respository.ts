import { InsuredPatientDTO } from 'src/app/entities/dtos/service/insuredPatient.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type GetInsuredPatientInput = {
  idContrato: string;
};

type GetInsuredPatientOutput = {
  data: {
    nombreCliente: string;
    estadoContrato: string;
  };
  esCorrecto: boolean;
};

export interface IGetInsuredPatientRepository {
  execute(contractId: string): Promise<InsuredPatientDTO>;
}

export class GetInsuredPatientRepository implements IGetInsuredPatientRepository {
  private readonly crp = CRPClient.instance;

  async execute(contractId: string): Promise<InsuredPatientDTO> {
    const input = this.parseInput(contractId);
    const rawResult = await this.crp.call<GetInsuredPatientOutput>({
      method: HttpMethod.GET,
      path: CRPServicePaths.GET_INSURED_PATIENT,
      query: input,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(contractId: string): GetInsuredPatientInput {
    return {
      idContrato: contractId,
    };
  }

  private parseOutput(rawResult: GetInsuredPatientOutput): InsuredPatientDTO {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ message: 'Did not found the insured patient' });
    }

    const insuredPatient: InsuredPatientDTO = {
      name: data.nombreCliente,
      contractState: data.estadoContrato,
    };

    return insuredPatient;
  }
}

export class GetInsuredPatientRepositoryMock implements IGetInsuredPatientRepository {
  async execute(): Promise<InsuredPatientDTO> {
    return {
      name: 'VI***  BA*** DE***',
      contractState: 'SUSPENDIDO',
    };
  }
}
