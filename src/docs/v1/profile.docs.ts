import { UpdateBiometricPasswordBodyDTOSchema } from 'src/app/entities/dtos/input/updateBiometricPassword.input.dto';
import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class ProfileV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/profile`,
      description: 'Get patient profile',
      tags: ['patients', 'profile'],
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientProfileOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.DELETE,
      path: `${this.version}/patients`,
      description: 'Delete patient account',
      tags: ['patients', 'profile'],
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.PATCH,
      path: `${this.version}/patients/biometric`,
      description: 'Add or update biometric password to patient account',
      tags: ['patients', 'profile'],
      body: UpdateBiometricPasswordBodyDTOSchema,
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
