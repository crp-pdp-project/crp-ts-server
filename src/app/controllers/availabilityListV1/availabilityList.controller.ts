import { FastifyReply, FastifyRequest } from 'fastify';

import {
  AvailabilityListInputDTO,
  AvailabilityListQueryDTOSchema,
} from 'src/app/entities/dtos/input/availabilityList.input.dto';
import { AvailabilityListOutputDTOSchema } from 'src/app/entities/dtos/output/availabilityList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  AvailabilityListInteractorBuilder,
  IAvailabilityListInteractor,
} from 'src/app/interactors/availabilityList/availabilityList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IAvailabilityListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AvailabilityListController implements IAvailabilityListController {
  private response?: ResponseModel;

  constructor(
    private readonly availabilityInteractor: IAvailabilityListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<AvailabilityListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const query = AvailabilityListQueryDTOSchema.parse(input.query);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.availabilityInteractor.list(query, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class AvailabilityListControllerBuilder {
  static build(): AvailabilityListController {
    return new AvailabilityListController(
      AvailabilityListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(AvailabilityListOutputDTOSchema),
    );
  }
}
