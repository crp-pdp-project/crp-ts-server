import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { ConfirmVerificationOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class ConfirmVerificationOTPV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/enroll/otp/validate`,
      description: 'Validate Sent OTP to enrolling patient ',
      tags: ['patients', 'enroll'],
      body: ConfirmVerificationOTPBodyDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/recover-password/otp/validate`,
      description: 'Validate Sent OTP to recovering patient ',
      tags: ['patients', 'recover'],
      body: ConfirmVerificationOTPBodyDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
