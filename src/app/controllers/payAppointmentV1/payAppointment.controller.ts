import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PayAppointmentBodyDTOSchema,
  PayAppointmentInputDTO,
  PayAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/payAppointment.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IPayAppointmentInteractor,
  PayAppointmentInteractorBuilder,
} from 'src/app/interactors/payAppointment/payAppointment.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPayAppointmentController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PayAppointmentController implements IPayAppointmentController {
  private response?: ResponseModel;

  constructor(
    private readonly payAppointment: IPayAppointmentInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PayAppointmentInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = PayAppointmentBodyDTOSchema.parse(input.body);
      const params = PayAppointmentParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      await this.payAppointment.pay(body, params, session);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PayAppointmentControllerBuilder {
  static build(): PayAppointmentController {
    return new PayAppointmentController(PayAppointmentInteractorBuilder.build(), ResponseManagerBuilder.buildEmpty());
  }
}
