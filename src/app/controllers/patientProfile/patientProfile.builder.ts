import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { PatientProfileModel } from 'src/app/entities/models/patientProfile.model';
import { PatientProfileInteractor } from 'src/app/interactors/patientProfile/patientProfile.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

import { PatientProfileController } from './patientProfile.controller';

export class PatientProfileBuilder {
  static build(): PatientProfileController {
    return new PatientProfileController(this.buildInteractor(), this.buildResponseInteractor());
  }

  private static buildInteractor(): PatientProfileInteractor {
    return new PatientProfileInteractor(new SearchPatientRepository());
  }

  private static buildResponseInteractor(): ResponseInteractor<PatientProfileModel> {
    return new ResponseInteractor(new DataResponseStrategy(PatientProfileOutputDTOSchema));
  }
}
