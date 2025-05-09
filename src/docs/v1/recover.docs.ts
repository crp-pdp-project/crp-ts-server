import { PatientVerificationBodyDTOSchema } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { UpdatePatientPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updatePatientPassword.input.dto';
import { ValidateVerificationOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class RecoverV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/recover`,
      description: 'Start recover process for new patient found in FMP',
      tags: ['patients', 'recover'],
      body: PatientVerificationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientVerificationOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/recover/send`,
      description: 'Send OTP to recovering patient',
      tags: ['patients', 'recover'],
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/recover/validate`,
      description: 'Validate Sent OTP to recovering patient ',
      tags: ['patients', 'recover'],
      body: ValidateVerificationOTPBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/patients/recover/update`,
      description: 'Update password to finish recovering process',
      tags: ['patients', 'recover'],
      body: UpdatePatientPasswordBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
