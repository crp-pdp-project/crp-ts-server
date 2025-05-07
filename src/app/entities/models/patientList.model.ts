import { PatientDTO } from '../dtos/service/patient.dto';

import { BaseModel } from './base.model';
import { PatientModel } from './patient.model';

export class PatientListModel extends BaseModel {
  readonly patients?: PatientModel[];

  constructor(patientsList: PatientDTO[]) {
    super();

    this.patients = this.generatePatientsList(patientsList);
  }

  private generatePatientsList(patientsList: PatientDTO[]): PatientModel[] {
    return patientsList.map((patient) => new PatientModel(patient));
  }
}
