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
  readonly relationship?: RelationshipModel;
  readonly relatives?: PatientModel[];

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
    this.relationship = this.resolveRelationship(patient);
    this.relatives = this.resolveRelatives(patient.relatives);
  }

  private resolveRelationship(patient: PatientDTO): RelationshipModel | undefined {
    if (!patient.relationship && Array.isArray(patient.relatives)) {
      return new RelationshipModel({
        id: 0,
        name: 'Titular de la cuenta',
      });
    }

    return patient.relationship ? new RelationshipModel(patient.relationship) : undefined;
  }

  private resolveRelatives(relatives?: PatientDTO[]): PatientModel[] | undefined {
    if (!relatives) return undefined;
    const filteredRelatives = relatives?.filter(Boolean) ?? [];

    return filteredRelatives.map((relative) => new PatientModel(relative));
  }
}
