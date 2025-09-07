import { FastifyReply, FastifyRequest } from 'fastify';

import { DoctorsListInputDTO, DoctorsListQueryDTOSchema } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  DoctorsListInteractorBuilder,
  IDoctorsListInteractor,
} from 'src/app/interactors/doctorsList/doctorsList.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IDoctorsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DoctorsListController implements IDoctorsListController {
  private response?: ResponseModel;

  constructor(
    private readonly doctorsInteractor: IDoctorsListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<DoctorsListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const query = DoctorsListQueryDTOSchema.parse(input.query);
      SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.doctorsInteractor.list(query);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class DoctorsListControllerBuilder {
  static build(): DoctorsListController {
    return new DoctorsListController(
      DoctorsListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(DoctorsListOutputDTOSchema),
    );
  }
}
