import { CreateAppointmentOutputDTOSchema } from 'src/app/entities/dtos/output/createAppointment.output.dto';
import { AppointmentModel } from 'src/app/entities/models/appointment.model';
import { CreateAppointmentInteractor } from 'src/app/interactors/createAppointment/createAppointment.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetCurrentAppointmentsRepository } from 'src/app/repositories/soap/getCurrentAppointments.repository';
import { SaveAppointmentRepository } from 'src/app/repositories/soap/saveAppointment.repository';

import { CreateAppointmentController } from './createAppointment.controller';

export class CreateAppointmentBuilder {
  static build(): CreateAppointmentController {
    const patientRelativesValidation = new PatientRelativesValidationRepository();
    const saveAppointment = new SaveAppointmentRepository();
    const currentAppointments = new GetCurrentAppointmentsRepository();
    const responseStrategy = new DataResponseStrategy(CreateAppointmentOutputDTOSchema);
    const appointmentInteractor = new CreateAppointmentInteractor(
      patientRelativesValidation,
      saveAppointment,
      currentAppointments,
    );
    const responseInteractor = new ResponseInteractor<AppointmentModel>(responseStrategy);

    return new CreateAppointmentController(appointmentInteractor, responseInteractor);
  }
}
