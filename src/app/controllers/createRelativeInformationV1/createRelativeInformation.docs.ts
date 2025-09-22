import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { CreateRelativeInformationBodyDTOSchema } from 'src/app/entities/dtos/input/createRelativeInformation.input.dto';
import { RelativeVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/relativeVerification.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class CreateRelativeInformationV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/relatives/information`,
      description: 'Create a new relative information',
      tags: ['patients', 'relatives'],
      headers: BaseHeadersDTOSchema,
      body: CreateRelativeInformationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: RelativeVerificationOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
