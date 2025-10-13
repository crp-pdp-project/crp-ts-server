import { FastifyReply, FastifyRequest } from 'fastify';

import { POSConfigOutputDTOSchema } from 'src/app/entities/dtos/output/posConfig.output.dto';
import { DeviceModel } from 'src/app/entities/models/device/device.model';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import { IPOSConfigInteractor, POSConfigInteractorBuilder } from 'src/app/interactors/posConfig/posConfig.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPOSConfigController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class POSConfigController implements IPOSConfigController {
  private response?: ResponseModel;

  constructor(
    private readonly posConfig: IPOSConfigInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const session = SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const device = DeviceModel.extractDevice(input.device);
      const model = await this.posConfig.config(session, device);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class POSConfigControllerBuilder {
  static build(): POSConfigController {
    return new POSConfigController(
      POSConfigInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(POSConfigOutputDTOSchema),
    );
  }
}
