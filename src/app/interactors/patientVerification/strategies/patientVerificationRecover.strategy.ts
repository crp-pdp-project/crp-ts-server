import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

import { IPatientVerificationStrategy } from '../patientVerification.interactor';

export class PatientVerificationRecoverStrategy implements IPatientVerificationStrategy {
  async persistVerification(_: PatientExternalDTO, patient?: PatientDTO): Promise<PatientDTO> {
    if (!patient?.id || !patient?.account) {
      throw ErrorModel.badRequest({ detail: ClientErrorMessages.PATIENT_NOT_REGISTERED });
    }

    return patient;
  }
}
