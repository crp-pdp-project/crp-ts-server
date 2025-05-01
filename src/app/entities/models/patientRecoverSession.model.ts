import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientRecoverModel } from 'src/app/entities/models/patientRecover.model';

export class PatientRecoverSessionModel extends BaseModel {
  readonly patientRecover: PatientRecoverModel;
  readonly token: string;

  constructor(patientRecover: PatientRecoverModel, token: string) {
    super();

    this.patientRecover = patientRecover;
    this.token = token;
  }
}
