import { OperateRelativeParamsDTOSchema } from 'src/app/entities/dtos/input/verifyRelative.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class RejectRelativeV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.DELETE,
      path: `${this.version}/patient/{patientId}/relatives/{relativeId}/verify`,
      description: 'Reject a relative',
      tags: ['back-office'],
      params: OperateRelativeParamsDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
