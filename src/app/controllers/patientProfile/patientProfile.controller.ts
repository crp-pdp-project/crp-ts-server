import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientProfileModel } from 'src/app/entities/models/patientProfile.model';
import { IPatientProfileInteractor } from 'src/app/interactors/patientProfile/patientProfile.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientProfileController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientProfileController implements IPatientProfileController {
  constructor(
    private readonly profileInteractor: IPatientProfileInteractor,
    private readonly responseInteractor: IResponseInteractor<PatientProfileModel>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const patient = await this.profileInteractor.profile(input);
    const response = this.responseInteractor.execute(patient);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
