import { FastifyReply, FastifyRequest } from 'fastify';

import {
  RescheduleAppointmentBodyDTOSchema,
  RescheduleAppointmentInputDTO,
  RescheduleAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/rescheduleAppointment.input.dto';
import { RescheduleAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/rescheduleAppointment.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  IRescheduleAppointmentInteractor,
  RescheduleAppointmentInteractorBuilder,
} from 'src/app/interactors/rescheduleAppointment/rescheduleAppointment.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IRescheduleAppointmentController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class RescheduleAppointmentController implements IRescheduleAppointmentController {
  private response?: ResponseModel;

  constructor(
    private readonly rescheduleAppointment: IRescheduleAppointmentInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<RescheduleAppointmentInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = RescheduleAppointmentParamsDTOSchema.parse(input.params);
      const body = RescheduleAppointmentBodyDTOSchema.parse(input.body);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.rescheduleAppointment.reschedule(body, params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class RescheduleAppointmentControllerBuilder {
  static build(): RescheduleAppointmentController {
    return new RescheduleAppointmentController(
      RescheduleAppointmentInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(RescheduleAppointmentOutputDTOSchema),
    );
  }
}
