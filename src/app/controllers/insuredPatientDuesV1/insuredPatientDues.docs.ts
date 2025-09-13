import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { InsuredPatientDuesParamsDTOSchema } from 'src/app/entities/dtos/input/insuredPatientDues.input.dto';
import { InsuredPatientDuesOutputDTOSchema } from 'src/app/entities/dtos/output/insuredPatientDues.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class InsuredPatientDuesV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/insurance/dues/{contractId}`,
      description: 'Get all patient relatives',
      tags: ['clinic-insurance'],
      headers: BaseHeadersDTOSchema,
      params: InsuredPatientDuesParamsDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: InsuredPatientDuesOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
