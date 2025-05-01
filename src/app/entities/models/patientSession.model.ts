import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export class PatientSessionModel extends BaseModel {
  readonly patient: PatientModel;
  readonly token: string;

  constructor(patient: PatientModel, token: string) {
    super();

    this.patient = patient;
    this.token = token;
  }
}
