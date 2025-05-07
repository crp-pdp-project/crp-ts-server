import { FastifyReply, FastifyRequest } from 'fastify';

import { DoctorsListInputDTO } from 'src/app/entities/dtos/input/doctorsList.input.dto';
import { DoctorListModel } from 'src/app/entities/models/doctorList.model';
import { IDoctorsListInteractor } from 'src/app/interactors/doctorsList/doctorsList.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IDoctorsListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class DoctorsListController implements IDoctorsListController {
  constructor(
    private readonly doctorsInteractor: IDoctorsListInteractor,
    private readonly responseInteractor: IResponseInteractor<DoctorListModel>,
  ) {}

  async handle(input: FastifyRequest<DoctorsListInputDTO>, reply: FastifyReply): Promise<void> {
    const doctors = await this.doctorsInteractor.list(input);
    const response = this.responseInteractor.execute(doctors);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
