import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { RelationshipModel } from 'src/app/entities/models/relationship.model';

export class PatientModel extends BaseModel {
  readonly id?: number;
  readonly fmpId?: string;
  readonly nhcId?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly secondLastName?: string | null;
  readonly documentNumber?: string;
  readonly documentType?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly relationship?: RelationshipModel | null;
  readonly relatives?: PatientModel[] | null;

  constructor(patient: PatientDTO) {
    super();

    this.id = patient.id;
    this.fmpId = patient.fmpId;
    this.nhcId = patient.nhcId;
    this.firstName = patient.firstName;
    this.lastName = patient.lastName;
    this.secondLastName = patient.secondLastName;
    this.documentNumber = patient.documentNumber;
    this.documentType = patient.documentType;
    this.createdAt = patient.createdAt;
    this.updatedAt = patient.updatedAt;
    this.relationship = patient.relationship ? new RelationshipModel(patient.relationship) : patient.relationship;
    this.relatives = patient.relatives ? patient.relatives.map((r) => new PatientModel(r)) : patient.relatives;
  }
}
