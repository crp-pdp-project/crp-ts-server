import { OperateX12BodyDTOSchema, OperateX12ParamsDTOSchema } from 'src/app/entities/dtos/input/operateX12.input.dto';
import { OperateX12OutputDTOSchema } from 'src/app/entities/dtos/output/operateX12.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class OperateX12V1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/x12/{operation}/{format}`,
      description: 'Operate an X12 payload',
      tags: ['X12'],
      body: OperateX12BodyDTOSchema,
      params: OperateX12ParamsDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: OperateX12OutputDTOSchema,
        }),
      },
    });
  }
}
