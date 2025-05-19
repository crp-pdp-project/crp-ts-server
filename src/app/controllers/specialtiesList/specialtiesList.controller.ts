import { FastifyReply, FastifyRequest } from 'fastify';

import { SpecialtyListModel } from 'src/app/entities/models/specialtyList.model';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { ISpecialtiesListInteractor } from 'src/app/interactors/specialtiesList/specialtiesList.interactor';

export interface ISpecialtiesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class SpecialtiesListController implements ISpecialtiesListController {
  constructor(
    private readonly specialtyInteractor: ISpecialtiesListInteractor,
    private readonly responseInteractor: IResponseInteractor<SpecialtyListModel>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const specialties = await this.specialtyInteractor.list(input);
    const response = this.responseInteractor.execute(specialties);
    reply.code(response.statusCode).send(response.body);
  }
}
