import { FastifyReply, FastifyRequest } from 'fastify';

import {
  SendDeepLinkNotificationBodyDTOSchema,
  SendDeepLinkNotificationInputDTO,
  SendDeepLinkNotificationParamsDTOSchema,
} from 'src/app/entities/dtos/input/sendDeepLinkNotification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  ISendDeepLinkNotificationInteractor,
  SendDeepLinkNotificationInteractorBuilder,
} from 'src/app/interactors/sendDeepLinkNotification/sendDeepLinkNotification.interactor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface ISendDeepLinkNotificationController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SendDeepLinkNotificationController implements ISendDeepLinkNotificationController {
  private response?: ResponseModel;

  constructor(
    private readonly sendNotification: ISendDeepLinkNotificationInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<SendDeepLinkNotificationInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = SendDeepLinkNotificationParamsDTOSchema.parse(input.params);
      const body = SendDeepLinkNotificationBodyDTOSchema.parse(input.body);
      await this.sendNotification.send(params, body);
      this.response = this.responseManager.validateResponse();
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class SendDeepLinkNotificationControllerBuilder {
  static build(): SendDeepLinkNotificationController {
    return new SendDeepLinkNotificationController(
      SendDeepLinkNotificationInteractorBuilder.build(),
      ResponseManagerBuilder.buildEmpty(),
    );
  }
}
