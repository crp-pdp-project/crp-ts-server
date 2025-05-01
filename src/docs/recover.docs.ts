import { RecoverPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/recoverPassword.input.dto';
import { UpdatePatientPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { ValidateRecoverOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateRecoverOtp.input.dto';
import { RecoverPasswordOutputDTOSchema } from 'src/app/entities/dtos/output/recoverPassword.output.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/service/emptyResponse.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/service/successResponse.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class RecoverDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover`,
      description: 'Start recover process for new patient found in FMP',
      tags: ['patients', 'recover'],
      body: RecoverPasswordBodyDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: RecoverPasswordOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover/send`,
      description: 'Send OTP to recovering patient',
      tags: ['patients', 'recover'],
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover/validate`,
      description: 'Validate Sent OTP to recovering patient ',
      tags: ['patients', 'recover'],
      body: ValidateRecoverOTPBodyDTOSchema,
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `/patients/recover/update`,
      description: 'Update password to finish recovering process',
      tags: ['patients', 'recover'],
      body: UpdatePatientPasswordBodyDTOSchema,
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
