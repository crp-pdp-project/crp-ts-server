import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class InformInsuranceInterestV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/health-insurances/inform`,
      description: 'Inform interest on the health insurance plan',
      tags: ['health-insurance'],
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
