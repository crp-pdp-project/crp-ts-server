import { FastifyReply, FastifyRequest } from 'fastify';

import { SpecialtiesListOutputDTOSchema } from 'src/app/entities/dtos/output/specialtiesList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  ISpecialtiesListInteractor,
  SpecialtiesListInteractorBuilder,
} from 'src/app/interactors/specialtiesList/specialtiesList.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISpecialtiesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SpecialtiesListController implements ISpecialtiesListController {
  private response?: ResponseModel;

  constructor(
    private readonly specialtyInteractor: ISpecialtiesListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const specialtiesList = await this.specialtyInteractor.list();
      this.response = this.responseManager.validateResponse(specialtiesList);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SpecialtiesListControllerBuilder {
  static build(): SpecialtiesListController {
    return new SpecialtiesListController(
      SpecialtiesListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(SpecialtiesListOutputDTOSchema),
    );
  }
}
