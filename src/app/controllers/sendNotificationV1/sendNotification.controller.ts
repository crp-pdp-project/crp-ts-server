import { FastifyReply, FastifyRequest } from 'fastify';

import {
  SendNotificationBodyDTOSchema,
  SendNotificationInputDTO,
} from 'src/app/entities/dtos/input/sendNotification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  ISendNotificationInteractor,
  SendNotificationInteractorBuilder,
} from 'src/app/interactors/sendNotification/sendNotification.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISendNotificationController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SendNotificationController implements ISendNotificationController {
  private response?: ResponseModel;

  constructor(
    private readonly sendNotification: ISendNotificationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<SendNotificationInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const body = SendNotificationBodyDTOSchema.parse(input.body);
      await this.sendNotification.send(body);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SendNotificationControllerBuilder {
  static build(): SendNotificationController {
    return new SendNotificationController(
      SendNotificationInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
