import { FastifyReply, FastifyRequest } from 'fastify';

import {
  SitedsPriceBodyDTOSchema,
  SitedsPriceInputDTO,
  SitedsPriceParamsDTOSchema,
} from 'src/app/entities/dtos/input/sitedsPrice.input.dto';
import { SitedsPriceOutputDTOSchema } from 'src/app/entities/dtos/output/sitedsPrice.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  ISitedsPriceInteractor,
  SitedsPriceInteractorBuilder,
} from 'src/app/interactors/sitedsPrice/sitedsPrice.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISitedsPriceController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SitedsPriceController implements ISitedsPriceController {
  private response?: ResponseModel;

  constructor(
    private readonly sitedsPrice: ISitedsPriceInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<SitedsPriceInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = SitedsPriceBodyDTOSchema.parse(input.body);
      const params = SitedsPriceParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.sitedsPrice.obtain(body, params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SitedsPriceControllerBuilder {
  static build(): SitedsPriceController {
    return new SitedsPriceController(
      SitedsPriceInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(SitedsPriceOutputDTOSchema),
    );
  }
}
