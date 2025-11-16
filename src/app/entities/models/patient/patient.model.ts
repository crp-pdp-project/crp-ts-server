import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { RelationshipModel } from 'src/app/entities/models/relationship/relationship.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { PatientDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import defaultRelationshipStatic from 'src/general/static/defaultRelationship.static';

import { DeviceDM } from '../../dms/devices.dm';
import { AccountModel } from '../account/account.model';
import { DeviceModel } from '../device/device.model';
import { ErrorModel } from '../error/error.model';

export class PatientModel extends BaseModel {
  readonly id?: number;
  readonly fmpId?: string;
  readonly nhcId?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly secondLastName?: string | null;
  readonly documentNumber?: string;
  readonly documentType?: PatientDocumentType;
  readonly birthDate?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly account?: AccountModel;
  readonly relationship?: RelationshipModel;
  readonly relatives?: PatientModel[];
  readonly principal?: PatientModel;
  readonly isVerified?: boolean;
  readonly isDependant?: boolean;

  #device?: DeviceModel;

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
    this.birthDate = patient.birthDate ? DateHelper.toFormatDate(patient.birthDate, 'spanishDate') : undefined;
    this.createdAt = patient.createdAt ? DateHelper.toFormatDateTime(patient.createdAt, 'spanishDateTime') : undefined;
    this.updatedAt = patient.updatedAt ? DateHelper.toFormatDateTime(patient.updatedAt, 'spanishDateTime') : undefined;
    this.isVerified = patient.isVerified != null ? !!patient.isVerified : undefined;
    this.isDependant = patient.isDependant != null ? !!patient.isDependant : undefined;
    this.account = patient.account ? new AccountModel(patient.account) : undefined;
    this.relationship = this.resolvePrincipalRelationship(patient);
    this.relatives = this.resolveRelatives(patient.relatives);
    this.principal = patient.principal ? new PatientModel(patient.principal) : undefined;
    this.#device = patient.device ? new DeviceModel(patient.device) : undefined;
  }

  get device(): DeviceModel | undefined {
    return this.#device;
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
        createdAt: this.createdAt,
        account: this.account ? { id: this.account.id } : undefined,
        device: this.#device ? { id: this.#device.id } : undefined,
      },
    };
  }

  inyectNewDevice(id: DeviceDM['id']): this {
    this.#device = new DeviceModel({ id });
    return this;
  }

  validatePatient(): void {
    if (!this.id) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.PATIENT_NOT_REGISTERED });
    }
  }

  private resolvePrincipalRelationship(patient: PatientDTO): RelationshipModel | undefined {
    if (!patient.relationship && Array.isArray(patient.relatives)) {
      return new RelationshipModel(defaultRelationshipStatic);
    }

    return patient.relationship ? new RelationshipModel(patient.relationship) : undefined;
  }

  private resolveRelatives(relatives?: PatientDTO[]): PatientModel[] | undefined {
    if (!relatives) return undefined;
    const filteredRelatives = relatives?.filter(Boolean) ?? [];

    return filteredRelatives.map(({ relatives: _, ...rest }) => new PatientModel(rest));
  }
}
