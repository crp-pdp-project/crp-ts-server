import { AddDeviceBiometricPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/addDeviceBiometricPassword.input.dto';
import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class AddDeviceBiometricPasswordV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/patients/biometric-password`,
      description: 'Add or update biometric password to patient device',
      tags: ['patients', 'profile'],
      body: AddDeviceBiometricPasswordBodyDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
