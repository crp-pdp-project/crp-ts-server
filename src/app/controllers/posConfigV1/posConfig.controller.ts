import { FastifyReply, FastifyRequest } from 'fastify';

import { POSConfigOutputDTOSchema } from 'src/app/entities/dtos/output/posConfig.output.dto';
import { POSConfigWebOutputDTOSchema } from 'src/app/entities/dtos/output/posConfigWeb.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { POSConfigModel } from 'src/app/entities/models/posConfig/posConfig.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

import { MobilePosConfigControllerStrategyBuilder } from './strategies/mobilePosConfig.strategy';
import { WebPosConfigControllerStrategyBuilder } from './strategies/webPosConfig.strategy';

export interface IPOSConfigControllerStrategy {
  execute(input: FastifyRequest): Promise<POSConfigModel>;
}

export interface IPOSConfigController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class POSConfigController implements IPOSConfigController {
  private response?: ResponseModel;

  constructor(
    private readonly posConfigStrategy: IPOSConfigControllerStrategy,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const model = await this.posConfigStrategy.execute(input);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class POSConfigControllerBuilder {
  static buildWeb(): POSConfigController {
    return new POSConfigController(
      WebPosConfigControllerStrategyBuilder.build(),
      ResponseManagerBuilder.buildData(POSConfigWebOutputDTOSchema),
    );
  }

  static buildMobile(): POSConfigController {
    return new POSConfigController(
      MobilePosConfigControllerStrategyBuilder.build(),
      ResponseManagerBuilder.buildData(POSConfigOutputDTOSchema),
    );
  }
}
