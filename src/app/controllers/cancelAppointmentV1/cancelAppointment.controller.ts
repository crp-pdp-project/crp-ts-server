import { FastifyReply, FastifyRequest } from 'fastify';

import {
  CancelAppointmentInputDTO,
  CancelAppointmentParamsDTOSchema,
} from 'src/app/entities/dtos/input/cancelAppointment.input.dto';
import { CancelAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/cancelAppointment.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel, SessionType } from 'src/app/entities/models/session/session.model';
import {
  CancelAppointmentInteractorBuilder,
  ICancelAppointmentInteractor,
} from 'src/app/interactors/cancelAppointment/cancelAppointment.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ICancelAppointmentController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CancelAppointmentController implements ICancelAppointmentController {
  private response?: ResponseModel;

  constructor(
    private readonly cancelAppointment: ICancelAppointmentInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<CancelAppointmentInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = CancelAppointmentParamsDTOSchema.parse(input.params);
      const session = SessionModel.validateSessionInstance(SessionType.SIGN_IN, input.session);
      const model = await this.cancelAppointment.cancel(params, session);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class CancelAppointmentControllerBuilder {
  static build(): CancelAppointmentController {
    return new CancelAppointmentController(
      CancelAppointmentInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(CancelAppointmentOutputDTOSchema),
    );
  }
}
