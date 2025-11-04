import { HealthInsuranceDataOutputDTOSchema } from 'src/app/entities/dtos/output/healthInsuranceData.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class HealthInsuranceDataV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/health-insurance`,
      description: 'Get current health insurance data',
      tags: ['back-office'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: HealthInsuranceDataOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
