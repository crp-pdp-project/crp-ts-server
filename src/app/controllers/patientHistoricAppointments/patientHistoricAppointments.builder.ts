import { PatientHistoricAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientHistoricAppointment.output.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { PatientHistoricAppointmentsInteractor } from 'src/app/interactors/patientHistoricAppointments/patientHistoricAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetHistoricAppointmentsRepository } from 'src/app/repositories/soap/getHistoricAppointments.repository';

import { PatientHistoricAppointmentsController } from './patientHistoricAppointments.controller';

export class PatientHistoricAppointmentsBuilder {
  static build(): PatientHistoricAppointmentsController {
    const patientRelativesValidation = new PatientRelativesValidationRepository();
    const historicAppointments = new GetHistoricAppointmentsRepository();
    const responseStrategy = new DataResponseStrategy(PatientHistoricAppointmentsOutputDTOSchema);
    const appointmentInteractor = new PatientHistoricAppointmentsInteractor(
      patientRelativesValidation,
      historicAppointments,
    );
    const responseInteractor = new ResponseInteractor<AppointmentListModel>(responseStrategy);

    return new PatientHistoricAppointmentsController(appointmentInteractor, responseInteractor);
  }
}
