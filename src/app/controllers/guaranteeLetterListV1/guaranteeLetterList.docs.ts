import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { GuaranteeLetterListParamsDTOSchema } from 'src/app/entities/dtos/input/guaranteeLetterList.input.dto';
import { GuaranteeLetterListOutputDTOSchema } from 'src/app/entities/dtos/output/guaranteeLetterList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class GuaranteeLetterListV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/patients/{fmpId}/guarantee-letters`,
      description: 'List all guarantee letters of a patient',
      tags: ['patients', 'guarantee-letters'],
      params: GuaranteeLetterListParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: GuaranteeLetterListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
