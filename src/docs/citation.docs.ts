import { DoctorsListQueryDTOSchema } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { SuccessResponseDTOSchema } from 'src/app/entities/dtos/output/successResponse.output.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class CitationDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.GET,
      path: `/doctors`,
      description: 'List all doctors',
      tags: ['doctors', 'citation'],
      query: DoctorsListQueryDTOSchema,
      responses: {
        200: SuccessResponseDTOSchema.extend({
          data: DoctorsListOutputDTOSchema,
        }),
      },
      secure: true,
    });
  }
}
