import { FastifyReply, FastifyRequest } from 'fastify';

import {
  InsuredPatientDuesInputDTO,
  InsuredPatientDuesParamsDTOSchema,
} from 'src/app/entities/dtos/input/insuredPatientDues.input.dto';
import { InsuredPatientDuesOutputDTOSchema } from 'src/app/entities/dtos/output/insuredPatientDues.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import { SessionModel } from 'src/app/entities/models/session/session.model';
import {
  IInsuredPatientDuesInteractor,
  InsuredPatientDuesInteractorBuilder,
} from 'src/app/interactors/insuredPatientDues/insuredPatientDues.interactor';
import { Audiences } from 'src/general/enums/audience.enum';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IInsuredPatientDuesController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class InsuredPatientDuesController implements IInsuredPatientDuesController {
  private response?: ResponseModel;

  constructor(
    private readonly insuredPatientDues: IInsuredPatientDuesInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<InsuredPatientDuesInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const params = InsuredPatientDuesParamsDTOSchema.parse(input.params);
      SessionModel.validateSessionInstance(Audiences.SIGN_IN, input.session);
      const model = await this.insuredPatientDues.list(params);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class InsuredPatientDuesControllerBuilder {
  static build(): InsuredPatientDuesController {
    return new InsuredPatientDuesController(
      InsuredPatientDuesInteractorBuilder.build(),
      ResponseManagerBuilder.buildData(InsuredPatientDuesOutputDTOSchema),
    );
  }
}
