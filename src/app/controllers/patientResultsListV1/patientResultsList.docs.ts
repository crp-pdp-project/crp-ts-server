import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  PatientResultsListParamsDTOSchema,
  PatientResultsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientResultsList.input.dto';
import { PatientResultsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientResultsList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientResultsListV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/results`,
      description: 'List all results of a patient',
      tags: ['patients', 'results'],
      params: PatientResultsListParamsDTOSchema,
      query: PatientResultsListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientResultsListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
