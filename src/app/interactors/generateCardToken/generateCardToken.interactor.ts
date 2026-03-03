import type { ZodSafeParseResult } from 'zod';

import type {
  GenerateCardTokenBodyDTO,
  GenerateCardTokenQueryDTO,
} from 'src/app/entities/dtos/input/generateCardToken.input.dto';
import { CardModel } from 'src/app/entities/models/card/card.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import type { IGetPOSCardTokenRepository } from 'src/app/repositories/rest/getPosCardToken.repository';
import { GetPOSCardTokenRepository } from 'src/app/repositories/rest/getPosCardToken.repository';
import { LoggerClient } from 'src/clients/logger/logger.client';

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
      const card = await this.getCardToken.execute(body.data.transactionToken, query.token).catch((error) => {
        const model = ErrorModel.fromError(error);
        LoggerClient.instance.error('Error obtaining CardToken', {
          message: model.message,
        });
      });

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
