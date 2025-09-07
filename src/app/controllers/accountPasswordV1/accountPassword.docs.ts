import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { CreateEnrolledAccountBodyDTOSchema } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { UpdatePatientPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class AccountPasswordV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/account`,
      description: 'Create account to finish enrollment process',
      tags: ['patients', 'enroll'],
      body: CreateEnrolledAccountBodyDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/patients/password`,
      description: 'Update password to finish recovering process',
      tags: ['patients', 'recover'],
      body: UpdatePatientPasswordBodyDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
