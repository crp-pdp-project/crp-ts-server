import { PatientVerificationBodyDTOSchema } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { UpdatePatientPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { ValidateVerificationOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class RecoverDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover`,
      description: 'Start recover process for new patient found in FMP',
      tags: ['patients', 'recover'],
      body: PatientVerificationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
          data: PatientVerificationOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover/send`,
      description: 'Send OTP to recovering patient',
      tags: ['patients', 'recover'],
      responses: {
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/recover/validate`,
      description: 'Validate Sent OTP to recovering patient ',
      tags: ['patients', 'recover'],
      body: ValidateVerificationOTPBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
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
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
