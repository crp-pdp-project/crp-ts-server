import { FastifyReply, FastifyRequest } from 'fastify';

import {
  AppointmentTypesListInputDTO,
  AppointmentTypesListQueryDTOSchema,
} from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AppointmentTypesListOutputDTOSchema } from 'src/app/entities/dtos/output/appointmentTypesList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  AppointmentTypesListInteractorBuilder,
  IAppointmentTypesListInteractor,
} from 'src/app/interactors/appointmentTypesList/appointmentTypesList.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IAppointmentTypesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AppointmentTypesListController implements IAppointmentTypesListController {
  private response?: ResponseModel;

  constructor(
    private readonly appointmentTypesInteractor: IAppointmentTypesListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<AppointmentTypesListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const query = AppointmentTypesListQueryDTOSchema.parse(input.query);
      SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.appointmentTypesInteractor.list(query);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class AppointmentTypesListControllerBuilder {
  static build(): AppointmentTypesListController {
    return new AppointmentTypesListController(
      AppointmentTypesListInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(AppointmentTypesListOutputDTOSchema),
    );
  }
}
