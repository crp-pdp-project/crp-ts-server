import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { PatientVerificationBodyDTOSchema } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class RelativeVerificationV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/relatives/verify`,
      description: 'Verify if relative exists',
      tags: ['patients', 'relatives'],
      headers: BaseHeadersDTOSchema,
      body: PatientVerificationBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientProfileOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
