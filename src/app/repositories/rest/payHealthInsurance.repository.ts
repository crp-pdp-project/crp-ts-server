import { POSAuthorizationDTO } from 'src/app/entities/dtos/service/posAuthorization.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { PosConstants } from 'src/general/contants/pos.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';

type PayHealthInsuranceInput = {
  authorization: {
    purchaseNumber: string;
    amount: number;
    currency: string;
    tokenId: string;
    email: string;
    codigoComercio: string;
  };
  planSalud: {
    idContrato: number;
    numDocumento: string[];
  };
};

type PayHealthInsuranceOutput = {
  esCorrecto: boolean;
};

export interface IPayHealthInsuranceRepository {
  execute(authorization: POSAuthorizationDTO, contractId: string, documents: string[]): Promise<void>;
}

export class PayHealthInsuranceRepository implements IPayHealthInsuranceRepository {
  private readonly crp = CRPClient.instance;

  async execute(authorization: POSAuthorizationDTO, contractId: string, documents: string[]): Promise<void> {
    const methodPayload = this.parseInput(authorization, contractId, documents);
    const rawResult = await this.crp.call<PayHealthInsuranceOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.PAY_CLINIC_INSURANCE,
      body: methodPayload,
    });
    this.checkOutput(rawResult);
  }

  private parseInput(
    authorization: POSAuthorizationDTO,
    contractId: string,
    documents: string[],
  ): PayHealthInsuranceInput {
    return {
      authorization: {
        purchaseNumber: authorization.purchaseNumber,
        amount: authorization.amount,
        currency: authorization.currency ?? PosConstants.DEFAULT_CURRENCY,
        tokenId: authorization.tokenId,
        email: authorization.email ?? PosConstants.DEFAULT_EMAIL,
        codigoComercio: authorization.commerceCode,
      },
      planSalud: {
        idContrato: Number(contractId),
        numDocumento: documents,
      },
    };
  }

  private checkOutput(rawResult: PayHealthInsuranceOutput): void {
    const { esCorrecto } = rawResult;

    if (!esCorrecto) {
      throw ErrorModel.badRequest({ message: 'Error processing the health insurance payment' });
    }
  }
}

export class PayHealthInsuranceRepositoryMock implements IPayHealthInsuranceRepository {
  async execute(): Promise<void> {
    await Promise.resolve();
  }
}
