import { FastifyReply, FastifyRequest } from 'fastify';

import { PatientHistoricAppointmentsInputDTO } from 'src/app/entities/dtos/input/patientHistoricAppointment.input.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { IPatientHistoricAppointmentsInteractor } from 'src/app/interactors/patientHistoricAppointments/patientHistoricAppointments.interactor';
import { IResponseInteractor } from 'src/app/interactors/response/response.interactor';

export interface IPatientHistoricAppointmentsController {
  handle(input: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class PatientHistoricAppointmentsController implements IPatientHistoricAppointmentsController {
  constructor(
    private readonly appointmentInteractor: IPatientHistoricAppointmentsInteractor,
    private readonly responseInteractor: IResponseInteractor<AppointmentListModel>,
  ) {}

  async handle(input: FastifyRequest<PatientHistoricAppointmentsInputDTO>, reply: FastifyReply): Promise<void> {
    const appointments = await this.appointmentInteractor.appointments(input);
    const response = this.responseInteractor.execute(appointments);
    reply.code(response.statusCode).send(response.body);
  }
}
