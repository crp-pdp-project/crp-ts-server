import { FastifyReply, FastifyRequest } from 'fastify';

import { AppointmentTypesListInputDTO } from 'src/app/entities/dtos/input/appointmentTypesList.input.dto';
import { AppointmentTypeModel } from 'src/app/entities/models/appointmentType.model';
import { IAppointmentTypesListInteractor } from 'src/app/interactors/appointmentTypesList/appointmentTypesList.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IAppointmentTypesListController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class AppointmentTypesListController implements IAppointmentTypesListController {
  constructor(
    private readonly appointmentTypesInteractor: IAppointmentTypesListInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentTypeModel[]>,
  ) {}

  async handle(input: FastifyRequest<AppointmentTypesListInputDTO>, reply: FastifyReply): Promise<void> {
    const appointmentTypes = await this.appointmentTypesInteractor.list(input);
    const response = this.responseInteractor.execute(appointmentTypes);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
