import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  PatientReportsListParamsDTOSchema,
  PatientReportsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientReportsList.input.dto';
import { PatientReportsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientReportsList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import type { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientReportsListV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/reports`,
      description: 'List all reports of a patient',
      tags: ['patients', 'reports'],
      params: PatientReportsListParamsDTOSchema,
      query: PatientReportsListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientReportsListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
