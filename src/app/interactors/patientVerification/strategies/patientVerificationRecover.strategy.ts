import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ClientErrorMessages } from 'src/general/enums/clientError.enum';

import { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationRecoverStrategy implements IPatientVerificationStrategy {
  async persisVerification(_: PatientExternalDTO, patient?: PatientDTO | null): Promise<number> {
    if (!patient?.id || !patient?.account) {
      throw ErrorModel.badRequest(ClientErrorMessages.PATIENT_NOT_REGISTERED);
    }

    return patient.id;
  }
}
