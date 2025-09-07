import { AvailabilityListQueryDTOSchema } from 'src/app/entities/dtos/input/availabilityList.input.dto';
import { BaseHeadersDTOSchema } from 'src/app/entities/dtos/input/baseHeaders.input.dto';
import { AvailabilityListOutputDTOSchema } from 'src/app/entities/dtos/output/availabilityList.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class AvailabilityListV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `${this.version}/doctors/availability`,
      description: 'List all availability of a doctor',
      tags: ['doctors', 'appointments'],
      query: AvailabilityListQueryDTOSchema,
      headers: BaseHeadersDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: AvailabilityListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
