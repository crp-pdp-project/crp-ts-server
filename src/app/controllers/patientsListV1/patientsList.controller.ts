import { FastifyReply, FastifyRequest } from 'fastify';

import {
  PatientsListInputDTO,
  PatientsListParamsDTOSchema,
  PatientsListQueryDTOSchema,
} from 'src/app/entities/dtos/input/patientsList.input.dto';
import { PatientsListOutputDTOSchema } from 'src/app/entities/dtos/output/patientsList.output.dto';
import { RelativesListOutputDTOSchema } from 'src/app/entities/dtos/output/relativesList.output.dto';
import { VerificationRequestListOutputDTOSchema } from 'src/app/entities/dtos/output/verificationRequestList.output.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { ResponseModel } from 'src/app/entities/models/response/response.model';
import {
  IPatientsListInteractor,
  PatientsListInteractorBuilder,
} from 'src/app/interactors/patientsList/patientsListinteractor';
import { IResponseManager, ResponseManagerBuilder } from 'src/general/managers/response/response.manager';

export interface IPatientsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientsListController implements IPatientsListController {
  private response?: ResponseModel;

  constructor(
    private readonly patientsList: IPatientsListInteractor,
    private readonly responseManager: IResponseManager,
  ) {}

  async handle(input: FastifyRequest<PatientsListInputDTO>, reply: FastifyReply): Promise<void> {
    try {
      const query = PatientsListQueryDTOSchema.parse(input.query);
      const params = Object.keys(input.params).length ? PatientsListParamsDTOSchema.parse(input.params) : input.params;
      const model = await this.patientsList.list(query, params);
      this.response = this.responseManager.validateResponse(model);
    } catch (error) {
      const errorModel = ErrorModel.fromError(error);
      this.response = this.responseManager.validateResponse(errorModel);
    }

    reply.code(this.response.statusCode).send(this.response.body);
  }
}

export class PatientsListControllerBuilder {
  static buildPrincipal(): PatientsListController {
    return new PatientsListController(
      PatientsListInteractorBuilder.buildPrincipal(),
      ResponseManagerBuilder.buildMixed(PatientsListOutputDTOSchema),
    );
  }

  static buildRelative(): PatientsListController {
    return new PatientsListController(
      PatientsListInteractorBuilder.buildRelative(),
      ResponseManagerBuilder.buildData(RelativesListOutputDTOSchema),
    );
  }

  static buildVerification(): PatientsListController {
    return new PatientsListController(
      PatientsListInteractorBuilder.buildVerification(),
      ResponseManagerBuilder.buildData(VerificationRequestListOutputDTOSchema),
    );
  }
}
