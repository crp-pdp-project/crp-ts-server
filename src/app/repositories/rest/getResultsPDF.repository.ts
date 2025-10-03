import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { ResponseType } from 'src/general/helpers/rest.helper';

type GetResultPDFInput = {
  Parametros: string;
  Centro: string;
};

export interface IGetResultPDFRepository {
  execute(resultId: string): Promise<Buffer>;
}

export class GetResultPDFRepository implements IGetResultPDFRepository {
  private readonly crp = CRPClient.instance;

  async execute(resultId: string): Promise<Buffer> {
    const methodPayload = this.parseInput(resultId);
    const rawResult = await this.crp.call<Buffer>({
      method: HttpMethod.POST,
      path: CRPServicePaths.GET_LAB_RESULT,
      body: methodPayload,
      responseType: ResponseType.ARRAY_BUFFER,
    });
    return this.checkOutput(rawResult);
  }

  private parseInput(resultId: string): GetResultPDFInput {
    return {
      Parametros: resultId,
      Centro: CRPConstants.CENTER_ID,
    };
  }

  private checkOutput(rawResult: Buffer): Buffer {
    if (!Buffer.isBuffer(rawResult)) {
      throw ErrorModel.notFound({ message: 'Did not found the document' });
    }

    return rawResult;
  }
}

export class GetResultPDFRepositoryMock implements IGetResultPDFRepository {
  async execute(): Promise<Buffer> {
    return Buffer.from(new ArrayBuffer());
  }
}
