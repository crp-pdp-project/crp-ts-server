import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientExternalModel } from 'src/app/entities/models/patientExternal.model';

export class PatientExternalSessionModel extends BaseModel {
  readonly patientExternal: PatientExternalModel;
  readonly token: string;

  constructor(patientExternal: PatientExternalModel, token: string) {
    super();

    this.patientExternal = patientExternal;
    this.token = token;
  }
}
