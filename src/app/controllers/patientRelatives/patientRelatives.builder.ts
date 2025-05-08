import { PatientRelativesOutputDTOSchema } from 'src/app/entities/dtos/output/patientRelatives.output.dto';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientRelativesInteractor } from 'src/app/interactors/patientRelatives/patientRelatives.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { PatientRelativesRepository } from 'src/app/repositories/database/patientRelatives.repository';

import { PatientRelativesController } from './patientRelatives.controller';

export class PatientRelativesBuilder {
  static build(): PatientRelativesController {
    const patientRelatives = new PatientRelativesRepository();
    const responseStrategy = new SuccessResponseStrategy(PatientRelativesOutputDTOSchema);
    const relativesInteractor = new PatientRelativesInteractor(patientRelatives);
    const responseInteractor = new ResponseInteractor<PatientModel>(responseStrategy);

    return new PatientRelativesController(relativesInteractor, responseInteractor);
  }
}
