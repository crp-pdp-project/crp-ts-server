import { UpdateBiometricPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updateBiometricPassword.input.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class ProfileDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/patients/profile`,
      description: 'Get patient profile',
      tags: ['patients', 'profile'],
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: PatientProfileOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.DELETE,
      path: `/patients`,
      description: 'Delete patient account',
      tags: ['patients', 'profile'],
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `/patients/biometric`,
      description: 'Add or update biometric password to patient account',
      tags: ['patients', 'profile'],
      body: UpdateBiometricPasswordBodyDTOSchema,
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
