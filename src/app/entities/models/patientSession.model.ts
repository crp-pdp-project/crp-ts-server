import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientModel } from 'src/app/entities/models/patient.model';

export class PatientSessionModel extends BaseModel {
  readonly patient: PatientModel;
  readonly token: string;

  constructor(patient: PatientModel, token: string) {
    super();

    this.patient = new PatientModel({
      id: patient.id,
      fmpId: patient.fmpId,
      nhcId: patient.nhcId,
      documentNumber: patient.documentNumber,
      documentType: patient.documentType,
      firstName: patient.firstName,
      lastName: patient.lastName,
      secondLastName: patient.secondLastName ?? null,
    });
    this.token = token;
  }
}
