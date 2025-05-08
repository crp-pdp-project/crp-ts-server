import { CreateEnrolledAccountBodyDTOSchema } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { PatientVerificationBodyDTOSchema } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { ValidateVerificationOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateVerificationOtp.input.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { PatientVerificationOutputDTOSchema } from 'src/app/entities/dtos/output/patientVerification.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class EnrollDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll`,
      description: 'Start enroll process for new patient found in FMP',
      tags: ['patients', 'enroll'],
      body: PatientVerificationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
          data: PatientVerificationOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll/send`,
      description: 'Send OTP to enrolling patient',
      tags: ['patients', 'enroll'],
      responses: {
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll/validate`,
      description: 'Validate Sent OTP to enrolling patient ',
      tags: ['patients', 'enroll'],
      body: ValidateVerificationOTPBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll/create`,
      description: 'Create password to finish enrolling process',
      tags: ['patients', 'enroll'],
      body: CreateEnrolledAccountBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
