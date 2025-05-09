import { FastifyReply, FastifyRequest } from 'fastify';

import { AvailabilityListInputDTO } from 'src/app/entities/dtos/input/availabilityList.input.dto';
import { AvailabilityListModel } from 'src/app/entities/models/availabilityList.model';
import { IAvailabilityListInteractor } from 'src/app/interactors/availabilityList/availabilityList.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IAvailabilityListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AvailabilityListController implements IAvailabilityListController {
  constructor(
    private readonly availabilityInteractor: IAvailabilityListInteractor,
    private readonly responseInteractor: IResponseInteractor<AvailabilityListModel>,
  ) {}

  async handle(input: FastifyRequest<AvailabilityListInputDTO>, reply: FastifyReply): Promise<void> {
    const availability = await this.availabilityInteractor.list(input);
    const response = this.responseInteractor.execute(availability);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
