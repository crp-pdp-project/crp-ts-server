import { PatientRelativesOutputDTOSchema } from 'src/app/entities/dtos/output/patientRelatives.output.dto';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientRelativesInteractor } from 'src/app/interactors/patientRelatives/patientRelatives.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { PatientRelativesRepository } from 'src/app/repositories/database/patientRelatives.repository';

import { PatientRelativesController } from './patientRelatives.controller';

export class PatientRelativesBuilder {
  static build(): PatientRelativesController {
    return new PatientRelativesController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): PatientRelativesInteractor {
    return new PatientRelativesInteractor(new PatientRelativesRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<PatientModel> {
    return new ResponseInteractor(new DataResponseStrategy(PatientRelativesOutputDTOSchema));
  }
}
