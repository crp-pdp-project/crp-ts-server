import { PatientProfileOutputDTOSchema } from 'src/app/entities/dtos/output/patientProfile.output.dto';
import { PatientProfileModel } from 'src/app/entities/models/patientProfile.model';
import { PatientProfileInteractor } from 'src/app/interactors/patientProfile/patientProfile.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { DataResponseStrategy } from 'src/app/interactors/response/strategies/dataResponse.strategy';
import { SearchPatientRepository } from 'src/app/repositories/soap/searchPatient.repository';

import { PatientProfileController } from './patientProfile.controller';

export class PatientProfileBuilder {
  static build(): PatientProfileController {
    const searchPatient = new SearchPatientRepository();
    const responseStrategy = new DataResponseStrategy(PatientProfileOutputDTOSchema);
    const profileInteractor = new PatientProfileInteractor(searchPatient);
    const responseInteractor = new ResponseInteractor<PatientProfileModel>(responseStrategy);

    return new PatientProfileController(profileInteractor, responseInteractor);
  }
}
