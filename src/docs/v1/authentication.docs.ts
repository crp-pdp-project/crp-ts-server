import { SignInBiometricBodyDTOSchema } from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { NoContentResponseDTOSchema } from 'src/app/entities/dtos/response/noContent.response.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class AuthenticationV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/sign-in`,
      description: 'Sign in a patient',
      tags: ['patients', 'authentication'],
      body: SignInPatientBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: SignInPatientOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/sign-in/biometric`,
      description: 'Sign in a patient with biometric authentication',
      tags: ['patients', 'authentication'],
      body: SignInBiometricBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: SignInPatientOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/sign-out`,
      description: 'Sign out a patient',
      tags: ['patients', 'authentication'],
      responses: {
        [StatusCode.NO_CONTENT]: NoContentResponseDTOSchema,
      },
      secure: true,
    });
  }
}
