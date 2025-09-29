import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import {
  SitedsPriceBodyDTOSchema,
  SitedsPriceParamsDTOSchema,
} from 'src/app/entities/dtos/input/sitedsPrice.input.dto';
import { SitedsPriceOutputDTOSchema } from 'src/app/entities/dtos/output/sitedsPrice.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class SitedsPriceV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/patients/{fmpId}/siteds`,
      description: 'Get siteds prices of a patient',
      tags: ['patients', 'siteds'],
      body: SitedsPriceBodyDTOSchema,
      params: SitedsPriceParamsDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: SitedsPriceOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
