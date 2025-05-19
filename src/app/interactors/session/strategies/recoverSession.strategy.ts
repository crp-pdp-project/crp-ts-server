import { RecoverSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/recoverSessionPayload.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { PatientExternalModel } from 'src/app/entities/models/patientExternal.model';
import { PatientExternalSessionModel } from 'src/app/entities/models/patientExternalSession.model';

import { ISessionStrategy } from '../session.interactor';

export class RecoverSessionStrategy implements ISessionStrategy<PatientExternalModel, PatientExternalSessionModel> {
  async toPayload(patient: PatientExternalModel): Promise<SessionPayloadDTO> {
    const payload = patient.toSessionPayload();

    return RecoverSessionPayloadDTOSchema.parse(payload);
  }

  toResponse(patient: PatientExternalModel, jwt: string): PatientExternalSessionModel {
    return new PatientExternalSessionModel(patient, jwt);
  }
}
