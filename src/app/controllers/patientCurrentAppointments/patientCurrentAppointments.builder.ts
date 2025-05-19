import { PatientCurrentAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientCurrentAppointment.output.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { PatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';

import { PatientCurrentAppointmentsController } from './patientCurrentAppointments.controller';

export class PatientCurrentAppointmentsBuilder {
  static build(): PatientCurrentAppointmentsController {
    const patientRelativesValidation = new PatientRelativesValidationRepository();
    const currentAppointments = new GetCurrentAppointmentsRepository();
    const responseStrategy = new DataResponseStrategy(PatientCurrentAppointmentsOutputDTOSchema);
    const appointmentInteractor = new PatientCurrentAppointmentsInteractor(
      patientRelativesValidation,
      currentAppointments,
    );
    const responseInteractor = new ResponseInteractor<AppointmentListModel>(responseStrategy);

    return new PatientCurrentAppointmentsController(appointmentInteractor, responseInteractor);
  }
}
