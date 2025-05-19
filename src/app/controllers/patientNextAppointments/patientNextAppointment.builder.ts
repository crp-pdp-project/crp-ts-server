import { PatientNextAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/patientNextAppointment.output.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { PatientCurrentAppointmentsInteractor } from 'src/app/interactors/patientCurrentAppointments/patientCurrentAppointments.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';

import { PatientNextAppointmentsController } from './patientNextAppointment.controller';

export class PatientNextAppointmentBuilder {
  static build(): PatientNextAppointmentsController {
    const patientRelativesValidation = new PatientRelativesValidationRepository();
    const currentAppointments = new GetCurrentAppointmentsRepository();
    const responseStrategy = new DataResponseStrategy(PatientNextAppointmentOutputDTOSchema);
    const appointmentInteractor = new PatientCurrentAppointmentsInteractor(
      patientRelativesValidation,
      currentAppointments,
    );
    const responseInteractor = new ResponseInteractor<AppointmentModel | void>(responseStrategy);

    return new PatientNextAppointmentsController(appointmentInteractor, responseInteractor);
  }
}
