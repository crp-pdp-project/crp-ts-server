import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PatientResultPDFParamsDTOSchema } from 'src/app/entities/dtos/input/patientResultPDF.input.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientResultPDFV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/results/documents/{resultId}`,
      description: 'Obtain an patient result document',
      tags: ['patients', 'results'],
      params: PatientResultPDFParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {},
      secure: true,
    });
  }
}
