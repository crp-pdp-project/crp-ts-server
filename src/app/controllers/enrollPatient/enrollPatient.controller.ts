import { FastifyReply, FastifyRequest } from 'fastify';

import { EnrollPatientInputDTO } from 'src/app/entities/dtos/input/enrollPatient.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientEnrollSessionModel } from 'src/app/entities/models/patientEnrollSession.model';
import { IEnrollPatientInteractor } from 'src/app/interactors/enrollPatient/enrollPatient.interactor';
import { IEnrollSessionInteractor } from 'src/app/interactors/enrollSession/enrollSession.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IEnrollPatientController {
  handle(input: FastifyRequest<EnrollPatientInputDTO>, reply: FastifyReply): Promise<void>;
}

export class EnrollPatientController implements IEnrollPatientController {
  constructor(
    private readonly enrollInteractor: IEnrollPatientInteractor,
    private readonly sessionInteractor: IEnrollSessionInteractor,
    private readonly responseInteractor: IResponseInteractor<PatientEnrollSessionModel>,
  ) {}

  async handle(input: FastifyRequest<EnrollPatientInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.enrollInteractor.enroll(input);
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
