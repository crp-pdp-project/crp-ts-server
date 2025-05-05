import { PatientCurrentAppointmentsOutputDTOSchema } from 'src/app/entities/dtos/output/patientCurrentAppointment.output.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.mpdel';
import { PatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';

import { PatientCurrentAppointmentsController } from './patientCurrentAppointments.controller';

export class PatientCurrentAppointmentsBuilder {
  static build(): PatientCurrentAppointmentsController {
    const currentAppointments = new GetCurrentAppointmentsRepository();
    const responseStrategy = new SuccessResponseStrategy(PatientCurrentAppointmentsOutputDTOSchema);
    const profileInteractor = new PatientCurrentAppointmentsInteractor(currentAppointments);
    const responseInteractor = new ResponseInteractor<AppointmentModel[]>(responseStrategy);

    return new PatientCurrentAppointmentsController(profileInteractor, responseInteractor);
  }
}
