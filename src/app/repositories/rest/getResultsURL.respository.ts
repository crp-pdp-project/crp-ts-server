import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

type GetResultsURLInput = {
  PatientId: string;
  AccessionNumber: string;
};

type GetResultsURLOutput = {
  data: string;
  esCorrecto: boolean;
};

export interface IGetResultsURLRepository {
  execute(accessNumber: string, nhcId: PatientDM['nhcId']): Promise<string>;
}

export class GetResultsURLRepository implements IGetResultsURLRepository {
  private readonly crp = CRPClient.instance;

  async execute(accessNumber: string, nhcId: PatientDM['nhcId']): Promise<string> {
    const input = this.parseInput(accessNumber, nhcId);
    const rawResult = await this.crp.call<GetResultsURLOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.GET_X_RAY_IMAGE_URL,
      body: input,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(accessNumber: string, nhcId: PatientDM['nhcId']): GetResultsURLInput {
    return {
      PatientId: TextHelper.stripLeadingZeros(nhcId)!,
      AccessionNumber: accessNumber,
    };
  }

  private parseOutput(rawResult: GetResultsURLOutput): string {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ message: 'Did not found the image url' });
    }

    return data;
  }
}

export class GetResultsURLRepositoryMock implements IGetResultsURLRepository {
  async execute(): Promise<string> {
    return 'https://any.any.com.pe/portal/default.aspx?urltoken=YPM';
  }
}
