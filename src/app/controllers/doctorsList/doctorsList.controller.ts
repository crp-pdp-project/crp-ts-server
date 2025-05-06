import { FastifyReply, FastifyRequest } from 'fastify';

import { DoctorsListInputDTO } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { DoctorModel } from 'src/app/entities/models/doctor.model';
import { IDoctorsListInteractor } from 'src/app/interactors/doctorsList/doctorsList.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IDoctorsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DoctorsListController implements IDoctorsListController {
  constructor(
    private readonly doctorsInteractor: IDoctorsListInteractor,
    private readonly responseInteractor: IResponseInteractor<DoctorModel[]>,
  ) {}

  async handle(input: FastifyRequest<DoctorsListInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.doctorsInteractor.list(input);
    const response = this.responseInteractor.execute(patient);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
