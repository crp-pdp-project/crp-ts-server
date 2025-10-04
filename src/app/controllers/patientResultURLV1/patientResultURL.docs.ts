import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PatientResultURLParamsDTOSchema } from 'src/app/entities/dtos/input/patientResultURL.input.dto';
import { PatientResultURLOutputDTOSchema } from 'src/app/entities/dtos/output/patientResultURL.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientResultURLV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/results/url/{accessNumber}`,
      description: 'Obtain an patient result url',
      tags: ['patients', 'results'],
      params: PatientResultURLParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientResultURLOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
