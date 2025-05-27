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
    return new CreateAppointmentController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): CreateAppointmentInteractor {
    return new CreateAppointmentInteractor(
      new PatientRelativesValidationRepository(),
      new SaveAppointmentRepository(),
      new GetCurrentAppointmentsRepository(),
    );
  }

  private static buildResponseInteractor(): ResponseInteractor<AppointmentModel> {
    return new ResponseInteractor(new DataResponseStrategy(CreateAppointmentOutputDTOSchema));
  }
}
