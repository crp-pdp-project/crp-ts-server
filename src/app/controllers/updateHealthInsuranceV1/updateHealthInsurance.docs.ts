import { UpdateHealthInsuranceBodyDTOSchema } from 'src/app/entities/dtos/input/updateHealthInsuranceView.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class UpdateHealthInsuranceV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.PUT,
      path: `${this.version}/health-insurance`,
      description: 'Update health insurance data',
      tags: ['back-office'],
      body: UpdateHealthInsuranceBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
