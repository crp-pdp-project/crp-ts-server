import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientEnrollModel } from 'src/app/entities/models/patientEnroll.model';

export class PatientEnrollSessionModel extends BaseModel {
  readonly patientEnroll: PatientEnrollModel;
  readonly token: string;

  constructor(patientEnroll: PatientEnrollModel, token: string) {
    super();

    this.patientEnroll = patientEnroll;
    this.token = token;
  }
}
