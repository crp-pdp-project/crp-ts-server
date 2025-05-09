import { SignInBiometricBodyDTOSchema } from 'src/app/entities/dtos/input/signInBiometric.input.dto';
import { SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/output/emptyResponse.output.dto';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
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
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
          data: SignInPatientOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/biometric/sign-in`,
      description: 'Sign in a patient with biometric authentication',
      tags: ['patients', 'authentication'],
      body: SignInBiometricBodyDTOSchema,
      responses: {
        [StatusCode.OK]: SuccessResponseDTOSchema.extend({
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
        [StatusCode.NO_CONTENT]: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
