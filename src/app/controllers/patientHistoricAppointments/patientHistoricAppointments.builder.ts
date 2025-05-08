import { PatientHistoricAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { PatientHistoricAppointmentsInteractor } from 'src/app/interactors/patientHistoricAppointments/patientHistoricAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';

import { PatientHistoricAppointmentsController } from './patientHistoricAppointments.controller';

export class PatientHistoricAppointmentsBuilder {
  static build(): PatientHistoricAppointmentsController {
    const historicAppointments = new GetHistoricAppointmentsRepository();
    const responseStrategy = new SuccessResponseStrategy(PatientHistoricAppointmentsOutputDTOSchema);
    const profileInteractor = new PatientHistoricAppointmentsInteractor(historicAppointments);
    const responseInteractor = new ResponseInteractor<AppointmentListModel>(responseStrategy);

    return new PatientHistoricAppointmentsController(profileInteractor, responseInteractor);
  }
}
