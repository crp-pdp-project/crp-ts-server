import {
  GenerateCardTokenBodyDTOSchema,
  GenerateCardTokenQueryDTOSchema,
} from 'src/app/entities/dtos/input/generateCardToken.input.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class GenerateCardTokenV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/pos/tokens/generate`,
      description: 'Generate POS Card Token',
      tags: ['pos'],
      query: GenerateCardTokenQueryDTOSchema,
      body: GenerateCardTokenBodyDTOSchema,
      responses: {},
    });
  }
}
