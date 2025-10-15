import { FastifyReply, FastifyRequest } from 'fastify';

import {
  GuaranteeLetterListInputDTO,
  GuaranteeLetterListParamsDTOSchema,
} from 'src/app/entities/dtos/input/guaranteeLetterList.input.dto';
import { GuaranteeLetterListOutputDTOSchema } from 'src/app/entities/dtos/output/guaranteeLetterList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  GuaranteeLetterListInteractorBuilder,
  IGuaranteeLetterListInteractor,
} from 'src/app/interactors/guaranteeLetterList/guaranteeLetterList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IGuaranteeLetterListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class GuaranteeLetterListController implements IGuaranteeLetterListController {
  private response?: ResponseModel;

  constructor(
    private readonly guaranteeLetterInteractor: IGuaranteeLetterListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<GuaranteeLetterListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = GuaranteeLetterListParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.guaranteeLetterInteractor.list(params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class GuaranteeLetterListControllerBuilder {
  static build(): GuaranteeLetterListController {
    return new GuaranteeLetterListController(
      GuaranteeLetterListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(GuaranteeLetterListOutputDTOSchema),
    );
  }
}
