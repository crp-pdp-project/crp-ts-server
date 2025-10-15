import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientResultDTO } from 'src/app/entities/dtos/service/patientResult.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

type GetResultsURLInput = {
  PatientId: string;
  AccessionNumber: string;
  NhC: string;
  NombreAgrupacion: string;
  NombrePrestacion: string;
};

type GetResultsURLOutput = {
  data: string;
  esCorrecto: boolean;
};

export interface IGetResultsURLRepository {
  execute(nhcId: PatientDM['nhcId'], result: PatientResultDTO): Promise<string>;
}

export class GetResultsURLRepository implements IGetResultsURLRepository {
  private readonly crp = CRPClient.instance;

  async execute(nhcId: PatientDM['nhcId'], result: PatientResultDTO): Promise<string> {
    const input = this.parseInput(nhcId, result);
    const rawResult = await this.crp.call<GetResultsURLOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.GET_X_RAY_IMAGE_URL,
      body: input,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(nhcId: PatientDM['nhcId'], result: PatientResultDTO): GetResultsURLInput {
    return {
      NhC: nhcId,
      PatientId: result.gidenpac ?? '',
      AccessionNumber: result.accessNumber ?? '',
      NombreAgrupacion: result.specialty?.name ?? '',
      NombrePrestacion: result.appointmentType?.name ?? '',
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
    return Promise.resolve('https://any.any.com.pe/portal/default.aspx?urltoken=YPM');
  }
}
