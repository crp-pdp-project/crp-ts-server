import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientVerificationInputDTO } from 'src/app/entities/dtos/input/patientVerification.input.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { PatientExternalModel } from 'src/app/entities/models/patientExternal.model';
import { PatientExternalSessionModel } from 'src/app/entities/models/patientExternalSession.model';
import { IPatientVerificationInteractor } from 'src/app/interactors/patientVerification/patientVerification.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { ISessionInteractor } from 'src/app/interactors/session/session.interactor';

export interface IRecoverPasswordController {
  handle(input: FastifyRequest<PatientVerificationInputDTO>, reply: FastifyReply): Promise<void>;
}

export class RecoverPasswordController implements IRecoverPasswordController {
  constructor(
    private readonly verificationInteractor: IPatientVerificationInteractor,
    private readonly sessionInteractor: ISessionInteractor<PatientExternalModel, PatientExternalSessionModel>,
    private readonly responseInteractor: IResponseInteractor<PatientExternalSessionModel>,
  ) {}

  async handle(input: FastifyRequest<PatientVerificationInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.verificationInteractor.verify(input);
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
