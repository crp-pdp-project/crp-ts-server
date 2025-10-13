import { FastifyReply, FastifyRequest } from 'fastify';

import {
  CreateAppointmentBodyDTOSchema,
  CreateAppointmentInputDTO,
  CreateAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/createAppointment.input.dto';
import { CreateAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/createAppointment.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  CreateAppointmentInteractorBuilder,
  ICreateAppointmentInteractor,
} from 'src/app/interactors/createAppointment/createAppointment.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ICreateAppointmentController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreateAppointmentController implements ICreateAppointmentController {
  private response?: ResponseModel;

  constructor(
    private readonly appointmentInteractor: ICreateAppointmentInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<CreateAppointmentInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = CreateAppointmentBodyDTOSchema.parse(input.body);
      const params = CreateAppointmentParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.appointmentInteractor.create(body, params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class CreateAppointmentControllerBuilder {
  static build(): CreateAppointmentController {
    return new CreateAppointmentController(
      CreateAppointmentInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(CreateAppointmentOutputDTOSchema),
    );
  }
}
