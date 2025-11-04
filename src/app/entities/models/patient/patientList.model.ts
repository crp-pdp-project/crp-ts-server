import { PatientDTO } from '../../dtos/service/patient.dto';
import { BaseModel } from '../base.model';

import { PatientModel } from './patient.model';

export class PatientListModel extends BaseModel {
  readonly list: PatientModel[];
  readonly hasNext: boolean;
  readonly nextCursor: number | null;

  constructor(patientsList: PatientDTO[], length: number) {
    super();

    const { patients, cursor } = this.splitData(patientsList, length);
    this.list = this.generatePatientsList(patients);
    this.hasNext = !!cursor;
    this.nextCursor = cursor?.id ?? null;
  }

  private splitData(patientsList: PatientDTO[], length: number): { patients: PatientDTO[]; cursor?: PatientDTO } {
    const patients = patientsList.slice(0, length);
    const cursor = patientsList[length];

    return { patients, cursor };
  }

  private generatePatientsList(patientsList: PatientDTO[]): PatientModel[] {
    return patientsList.map((patient) => new PatientModel(patient));
  }
}
