import { FastifyReply, FastifyRequest } from 'fastify';

import { RecoverPasswordInputDTO } from 'src/app/entities/dtos/input/recoverPassword.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientRecoverSessionModel } from 'src/app/entities/models/patientRecoverSession.model';
import { IRecoverPasswordInteractor } from 'src/app/interactors/recoverPassword/recoverPassword.interactor';
import { IRecoverSessionInteractor } from 'src/app/interactors/recoverSession/enrollSession.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IRecoverPasswordController {
  handle(input: FastifyRequest<RecoverPasswordInputDTO>, reply: FastifyReply): Promise<void>;
}

export class RecoverPasswordController implements IRecoverPasswordController {
  constructor(
    private readonly recoverInteractor: IRecoverPasswordInteractor,
    private readonly sessionInteractor: IRecoverSessionInteractor,
    private readonly responseInteractor: IResponseInteractor<PatientRecoverSessionModel>,
  ) {}

  async handle(input: FastifyRequest<RecoverPasswordInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.recoverInteractor.recover(input);
    if (patient instanceof ErrorModel) {
      const partialErrorResponse = this.responseInteractor.execute(patient);
      reply.code(partialErrorResponse.statusCode).send(partialErrorResponse.toResponseObject());
    } else {
      const session = await this.sessionInteractor.session(patient);
      const response = this.responseInteractor.execute(session);
      reply.code(response.statusCode).send(response.toResponseObject());
    }
  }
}
