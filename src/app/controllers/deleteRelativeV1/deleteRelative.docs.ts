import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { DeleteRelativeParamsDTOSchema } from 'src/app/entities/dtos/input/deleteRelative.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class DeleteRelativeV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.DELETE,
      path: `${this.version}/patients/relatives/{relativeId}`,
      description: 'Delete a relative',
      tags: ['patients', 'relatives'],
      headers: BaseHeadersDTOSchema,
      params: DeleteRelativeParamsDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
