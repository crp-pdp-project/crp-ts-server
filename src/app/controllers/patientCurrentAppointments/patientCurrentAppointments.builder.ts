import { PatientCurrentAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientCurrentAppointment.output.dto';
import { AppointmentListModel } from 'src/app/entities/models/appointmentsList.model';
import { PatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';

import { PatientCurrentAppointmentsController } from './patientCurrentAppointments.controller';

export class PatientCurrentAppointmentsBuilder {
  static build(): PatientCurrentAppointmentsController {
    const currentAppointments = new GetCurrentAppointmentsRepository();
    const responseStrategy = new SuccessResponseStrategy(PatientCurrentAppointmentsOutputDTOSchema);
    const appointmentInteractor = new PatientCurrentAppointmentsInteractor(currentAppointments);
    const responseInteractor = new ResponseInteractor<AppointmentListModel>(responseStrategy);

    return new PatientCurrentAppointmentsController(appointmentInteractor, responseInteractor);
  }
}
