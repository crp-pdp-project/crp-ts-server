import { CreateEnrolledAccountBodyDTOSchema } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { PatientVerificationBodyDTOSchema } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { ValidateVerificationOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class EnrollV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/enroll`,
      description: 'Start enroll process for new patient found in FMP',
      tags: ['patients', 'enroll'],
      body: PatientVerificationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientVerificationOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/enroll/otp/send`,
      description: 'Send OTP to enrolling patient',
      tags: ['patients', 'enroll'],
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/enroll/otp/validate`,
      description: 'Validate Sent OTP to enrolling patient ',
      tags: ['patients', 'enroll'],
      body: ValidateVerificationOTPBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/account`,
      description: 'Create account to finish enrollment process',
      tags: ['patients', 'enroll'],
      body: CreateEnrolledAccountBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
