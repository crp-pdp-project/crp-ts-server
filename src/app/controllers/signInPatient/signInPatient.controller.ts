import { FastifyReply, FastifyRequest } from 'fastify';

import { SignInPatientInputDTO } from 'src/app/entities/dtos/input/signInPatient.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { ISessionInteractor } from 'src/app/interactors/session/session.interactor';
import { ISignInPatientInteractor } from 'src/app/interactors/signInPatient/signInPatient.interactor';

export interface ISignInPatientController {
  handle(input: FastifyRequest<SignInPatientInputDTO>, reply: FastifyReply): Promise<void>;
}

export class SignInPatientController implements ISignInPatientController {
  constructor(
    private readonly signInInteractor: ISignInPatientInteractor,
    private readonly sessionInteractor: ISessionInteractor<PatientModel, PatientSessionModel>,
    private readonly responseInteractor: IResponseInteractor<PatientSessionModel>,
  ) {}

  async handle(input: FastifyRequest<SignInPatientInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.signInInteractor.signIn(input);
    if (patient instanceof ErrorModel) {
      const partialErrorResponse = this.responseInteractor.execute(patient);
      reply.code(partialErrorResponse.statusCode).send(partialErrorResponse.body);
    } else {
      const session = await this.sessionInteractor.session(patient);
      const response = this.responseInteractor.execute(session);
      reply.code(response.statusCode).send(response.body);
    }
  }
}
