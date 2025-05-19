import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { SignInSessionPayloadDTOSchema } from 'src/app/entities/dtos/service/signInSessionPayload.dto';
import { PatientModel } from 'src/app/entities/models/patient.model';
import { PatientSessionModel } from 'src/app/entities/models/patientSession.model';

import { ISessionStrategy } from '../session.interactor';

export class PatientSessionStrategy implements ISessionStrategy<PatientModel, PatientSessionModel> {
  async toPayload(patient: PatientModel): Promise<SessionPayloadDTO> {
    const payload = patient.toSessionPayload();

    return SignInSessionPayloadDTOSchema.parse(payload);
  }

  toResponse(patient: PatientModel, jwt: string): PatientSessionModel {
    return new PatientSessionModel(patient, jwt);
  }
}
