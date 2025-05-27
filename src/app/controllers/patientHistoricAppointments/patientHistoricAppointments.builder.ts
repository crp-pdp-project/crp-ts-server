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
    return new PatientHistoricAppointmentsController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): PatientHistoricAppointmentsInteractor {
    return new PatientHistoricAppointmentsInteractor(
      new PatientRelativesValidationRepository(),
      new GetHistoricAppointmentsRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<AppointmentListModel> {
    return new ResponseInteractor(new DataResponseStrategy(PatientHistoricAppointmentsOutputDTOSchema));
  }
}
