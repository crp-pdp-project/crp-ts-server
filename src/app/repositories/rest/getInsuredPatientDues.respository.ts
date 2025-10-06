import { InsuredPatientDuesDTO } from 'src/app/entities/dtos/service/insuredPatientDues.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type GetInsuredPatientDuesInput = {
  idContrato: string;
};

type GetInsuredPatientDuesOutput = {
  data: {
    version: {
      nroVersion: number;
      listaConsultaDeuda: {
        numDocumento: string;
        fechaVenc: string;
        estaVencido: string;
        deuda: number;
        mora: number;
        gastAdm: number;
        pagoMin: number;
        periodo: string;
        anio: string;
        cuota: string;
      }[];
    }[];
  };
  esCorrecto: boolean;
};

export interface IGetInsuredPatientDuesRepository {
  execute(contractId: string): Promise<InsuredPatientDuesDTO[]>;
}

export class GetInsuredPatientDuesRepository implements IGetInsuredPatientDuesRepository {
  private readonly crp = CRPClient.instance;

  async execute(contractId: string): Promise<InsuredPatientDuesDTO[]> {
    const input = this.parseInput(contractId);
    const rawResult = await this.crp.call<GetInsuredPatientDuesOutput>({
      method: HttpMethod.GET,
      path: CRPServicePaths.GET_INSURED_PATIENT_DUES,
      query: input,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(contractId: string): GetInsuredPatientDuesInput {
    return {
      idContrato: contractId,
    };
  }

  private parseOutput(rawResult: GetInsuredPatientDuesOutput): InsuredPatientDuesDTO[] {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ message: 'Did not found the insured patient' });
    }

    const dues: InsuredPatientDuesDTO[] = data.version.map((dueGroup) => ({
      versionNumber: dueGroup.nroVersion,
      dueList: dueGroup.listaConsultaDeuda.map((groupItem) => ({
        id: groupItem.numDocumento,
        dueDate: groupItem.fechaVenc,
        isOverdue: groupItem.estaVencido === '1',
        amount: groupItem.deuda,
        lateFee: groupItem.mora,
        administrativeFee: groupItem.gastAdm,
        minAmount: groupItem.pagoMin,
        dueNumber: groupItem.cuota,
        dueYear: groupItem.anio,
      })) as InsuredPatientDuesDTO['dueList'],
    }));

    return dues;
  }
}

export class GetInsuredPatientDuesRepositoryMock implements IGetInsuredPatientDuesRepository {
  async execute(): Promise<InsuredPatientDuesDTO[]> {
    return [
      {
        versionNumber: 1,
        dueList: [
          {
            id: '123124-1-12',
            dueDate: '16072025',
            isOverdue: false,
            amount: 132.65,
            lateFee: 0,
            administrativeFee: 0,
            minAmount: 132.65,
            dueYear: '2025',
            dueNumber: '12',
          },
        ],
      },
    ];
  }
}
