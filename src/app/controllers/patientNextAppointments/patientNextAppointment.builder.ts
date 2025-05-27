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
    return new PatientNextAppointmentsController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): PatientCurrentAppointmentsInteractor {
    return new PatientCurrentAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new GetCurrentAppointmentsRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<AppointmentModel | void> {
    return new ResponseInteractor(new DataResponseStrategy(PatientNextAppointmentOutputDTOSchema));
  }
}
