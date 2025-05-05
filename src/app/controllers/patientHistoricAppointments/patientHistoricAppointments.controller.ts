import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientHistoricAppointmentsInputDTO } from 'src/app/entities/dtos/input/patientHistoricAppointments.input.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.mpdel';
import { IPatientHistoricAppointmentsInteractor } from 'src/app/interactors/patientHistoricAppointments/patientHistoricAppointments.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientHistoricAppointmentsController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientHistoricAppointmentsController implements IPatientHistoricAppointmentsController {
  constructor(
    private readonly appointmentInteractor: IPatientHistoricAppointmentsInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentModel[]>,
  ) {}

  async handle(input: FastifyRequest<PatientHistoricAppointmentsInputDTO>, reply: FastifyReply): Promise<void> {
    const patient = await this.appointmentInteractor.appointments(input);
    const response = this.responseInteractor.execute(patient);
    reply.code(response.statusCode).send(response.toResponseObject());
  }
}
