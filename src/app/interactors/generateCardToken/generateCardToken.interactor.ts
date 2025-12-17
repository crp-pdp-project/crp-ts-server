import { ZodSafeParseResult } from 'zod';

import {
  GenerateCardTokenBodyDTO,
  GenerateCardTokenQueryDTO,
} from 'src/app/entities/dtos/input/generateCardToken.input.dto';
import { CardModel } from 'src/app/entities/models/card/card.model';
import {
  GetPOSCardTokenRepository,
  IGetPOSCardTokenRepository,
} from 'src/app/repositories/rest/getPosCardToken.repository';

export interface IGenerateCardTokenInteractor {
  generate(body: ZodSafeParseResult<GenerateCardTokenBodyDTO>, query: GenerateCardTokenQueryDTO): Promise<CardModel>;
}

export class GenerateCardTokenInteractor implements IGenerateCardTokenInteractor {
  constructor(private readonly getCardToken: IGetPOSCardTokenRepository) {}

  async generate(
    body: ZodSafeParseResult<GenerateCardTokenBodyDTO>,
    query: GenerateCardTokenQueryDTO,
  ): Promise<CardModel> {
    const model = new CardModel(query.redirect);
    if (body.success) {
      const card = await this.getCardToken.execute(body.data.transactionToken).catch(() => undefined);

      model.inyectTokenId(card?.token?.tokenId);
    }

    return model;
  }
}

export class GenerateCardTokenInteractorBuilder {
  static build(): GenerateCardTokenInteractor {
    return new GenerateCardTokenInteractor(new GetPOSCardTokenRepository());
  }
}
