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
    return new PatientCurrentAppointmentsController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): PatientCurrentAppointmentsInteractor {
    return new PatientCurrentAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new GetCurrentAppointmentsRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<AppointmentListModel> {
    return new ResponseInteractor(new DataResponseStrategy(PatientCurrentAppointmentsOutputDTOSchema));
  }
}
