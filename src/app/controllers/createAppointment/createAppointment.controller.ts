import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateAppointmentInputDTO } from 'src/app/entities/dtos/input/createAppointment.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { ICreateAppointmentInteractor } from 'src/app/interactors/createAppointment/createAppointment.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface ICreateAppointmentController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CreateAppointmentController implements ICreateAppointmentController {
  constructor(
    private readonly appointmentInteractor: ICreateAppointmentInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentModel>,
  ) {}

  async handle(input: FastifyRequest<CreateAppointmentInputDTO>, reply: FastifyReply): Promise<void> {
    const appointment = await this.appointmentInteractor.create(input);
    const response = this.responseInteractor.execute(appointment);
    reply.code(response.statusCode).send(response.body);
  }
}
