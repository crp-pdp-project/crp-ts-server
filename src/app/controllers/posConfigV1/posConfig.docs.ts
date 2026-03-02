import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { POSConfigWebBodyDTOSchema } from 'src/app/entities/dtos/input/posConfigWeb.input.dto';
import { POSConfigOutputDTOSchema } from 'src/app/entities/dtos/output/posConfig.output.dto';
import { POSConfigWebOutputDTOSchema } from 'src/app/entities/dtos/output/posConfigWeb.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import type { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class POSConfigV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/pos/config`,
      description: 'Get POS config',
      tags: ['pos'],
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: POSConfigOutputDTOSchema,
        }),
      },
      secure: true,
    });
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/pos/config/web`,
      description: 'Get web POS config',
      tags: ['pos'],
      headers: BaseHeadersDTOSchema,
      body: POSConfigWebBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: POSConfigWebOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
