import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { RelationshipModel } from 'src/app/entities/models/relationship.model';
import { PatientConstants } from 'src/general/contants/patient.constants';

import { SessionPayloadDTO } from '../dtos/service/sessionPayload.dto';

import { AccountModel } from './account.model';

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
  readonly account?: AccountModel;
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
    this.account = patient.account ? new AccountModel(patient.account) : undefined;
    this.relationship = this.resolveRelationship(patient);
    this.relatives = this.resolveRelatives(patient.relatives);
  }

  toSessionPayload(): SessionPayloadDTO {
    return {
      patient: {
        id: this.id,
        fmpId: this.fmpId,
        nhcId: this.nhcId,
        documentNumber: this.documentNumber,
        documentType: this.documentType,
        firstName: this.firstName,
        lastName: this.lastName,
        account: this.account ? { id: this.account.id } : undefined,
      },
    };
  }

  private resolveRelationship(patient: PatientDTO): RelationshipModel | undefined {
    if (!patient.relationship && Array.isArray(patient.relatives)) {
      return new RelationshipModel(PatientConstants.DEFAUL_RELATIONSHIP);
    }

    return patient.relationship ? new RelationshipModel(patient.relationship) : undefined;
  }

  private resolveRelatives(relatives?: PatientDTO[]): PatientModel[] | undefined {
    if (!relatives) return undefined;
    const filteredRelatives = relatives?.filter(Boolean) ?? [];

    return filteredRelatives.map(({ relatives: _, ...rest }) => new PatientModel(rest));
  }
}
