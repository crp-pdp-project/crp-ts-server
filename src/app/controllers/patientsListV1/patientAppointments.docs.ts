import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  PatientsListParamsDTOSchema,
  PatientsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientsList.output.dto';
import { RelativesListOutputDTOSchema } from 'src/app/entities/dtos/output/relativesList.output.dto';
import { VerificationRequestListOutputDTOSchema } from 'src/app/entities/dtos/output/verificationRequestList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class PatientsListV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients`,
      description: 'Patient full list',
      tags: ['back-office'],
      query: PatientsListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: PatientsListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{id}/relatives`,
      description: 'Patient relatives list',
      tags: ['back-office'],
      params: PatientsListParamsDTOSchema,
      query: PatientsListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: RelativesListOutputDTOSchema,
        }),
      },
      secure: true,
    });

    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/relatives/requests`,
      description: 'Relatives verification request list',
      tags: ['back-office'],
      query: PatientsListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: VerificationRequestListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
