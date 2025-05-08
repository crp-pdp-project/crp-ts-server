import { FastifyReply, FastifyRequest } from 'fastify';

import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { IPatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientCurrentAppointmentsController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientCurrentAppointmentsController implements IPatientCurrentAppointmentsController {
  constructor(
    private readonly appointmentInteractor: IPatientCurrentAppointmentsInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentListModel>,
  ) {}

  async handle(input: FastifyRequest, reply: FastifyReply): Promise<void> {
    const patient = await this.appointmentInteractor.appointments(input);
    const response = this.responseInteractor.execute(patient);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
