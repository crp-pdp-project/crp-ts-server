import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientModel } from 'src/app/entities/models/patient.model';
import { IPatientRelativesInteractor } from 'src/app/interactors/patientRelatives/patientRelatives.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientRelativesController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientRelativesController implements IPatientRelativesController {
  constructor(
    private readonly relativesInteractor: IPatientRelativesInteractor,
    private readonly responseInteractor: IResponseInteractor<PatientModel>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const patient = await this.relativesInteractor.relatives(input);
    const response = this.responseInteractor.execute(patient);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
