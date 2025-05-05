import { CreateEnrolledAccountBodyDTOSchema } from 'src/app/entities/dtos/input/createEnrolledAccount.input.dto';
import { EnrollPatientBodyDTOSchema } from 'src/app/entities/dtos/input/enrollPatient.input.dto';
import { ValidateEnrollOTPBodyDTOSchema } from 'src/app/entities/dtos/input/validateEnrollOtp.input.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { EnrollPatientOutputDTOSchema } from 'src/app/entities/dtos/output/enrollPatient.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class EnrollDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll`,
      description: 'Start enroll process for new patient found in FMP',
      tags: ['patients', 'enroll'],
      body: EnrollPatientBodyDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: EnrollPatientOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll/send`,
      description: 'Send OTP to enrolling patient',
      tags: ['patients', 'enroll'],
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/enroll/validate`,
      description: 'Validate Sent OTP to enrolling patient ',
      tags: ['patients', 'enroll'],
      body: ValidateEnrollOTPBodyDTOSchema,
      responses: {
        204: EmptyResponseDTOSchema,
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
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
