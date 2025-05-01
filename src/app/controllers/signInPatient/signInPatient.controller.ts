import { FastifyReply, FastifyRequest } from 'fastify';

import { SignInPatientInputDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { ISignInPatientInteractor } from 'src/app/interactors/signInPatient/signInPatient.interactor';
import { ISignInSessionInteractor } from 'src/app/interactors/signInSession/signInSession.interactor';

export interface ISignInPatientController {
  handle(input: FastifyRequest<SignInPatientInputDTO>, reply: FastifyReply): Promise<void>;
}

export class SignInPatientController implements ISignInPatientController {
  constructor(
    private readonly enrollInteractor: ISignInPatientInteractor,
    private readonly sessionInteractor: ISignInSessionInteractor,
    private readonly responseInteractor: IResponseInteractor<PatientSessionModel>,
  ) {}

  async handle(input: FastifyRequest<SignInPatientInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.enrollInteractor.signIn(input);
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
