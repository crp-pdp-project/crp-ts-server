import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PayHealthInsuranceBodyDTOSchema } from 'src/app/entities/dtos/input/payHealthInsurance.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PayHealthInsuranceV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/health-insurances/pay`,
      description: 'Pay any number of health insurance dues',
      tags: ['health-insurance'],
      headers: BaseHeadersDTOSchema,
      body: PayHealthInsuranceBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
