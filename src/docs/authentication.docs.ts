import { SignInPatientBodyDTOSchema } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { SignInPatientOutputDTOSchema } from 'src/app/entities/dtos/output/signInPatient.output.dto';
import { EmptyResponseDTOSchema } from 'src/app/entities/dtos/service/emptyResponse.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/service/successResponse.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class AuthenticationDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/sign-in`,
      description: 'Sign in a patient',
      tags: ['patients', 'authentication'],
      body: SignInPatientBodyDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: SignInPatientOutputDTOSchema,
        }),
      },
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `/patients/sign-out`,
      description: 'Sign out a patient',
      tags: ['patients', 'authentication'],
      responses: {
        204: EmptyResponseDTOSchema,
      },
      secure: true,
    });
  }
}
