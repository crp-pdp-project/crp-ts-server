import { FastifyReply, FastifyRequest } from 'fastify';

import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { IPatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientNextAppointmentsController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientNextAppointmentsController implements IPatientNextAppointmentsController {
  constructor(
    private readonly appointmentInteractor: IPatientCurrentAppointmentsInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentModel | void>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const appointment = await this.appointmentInteractor.appointment(input);
    const response = this.responseInteractor.execute(appointment);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
