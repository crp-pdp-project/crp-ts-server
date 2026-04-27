import { BaseModel } from 'src/app/entities/models/base.model';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { PatientDocumentType } from 'src/general/enums/patientInfo.enum';
import { TextHelper } from 'src/general/helpers/text.helper';

import type { PatientLegalGuardianDTO } from '../../dtos/service/patientLegalGuardian.dto';
import { ErrorModel } from '../error/error.model';

export class PatientLegalGuardianModel extends BaseModel {
  readonly legalGuardianId?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly secondLastName?: string | null;
  readonly documentNumber?: string;
  readonly documentType?: PatientDocumentType;
  readonly email?: string | null;
  readonly phone?: string | null;

  constructor(legalGuardian: PatientLegalGuardianDTO) {
    super();

    this.legalGuardianId = legalGuardian.legalGuardianId;
    this.email = legalGuardian.email;
    this.phone = TextHelper.normalizePhoneNumber(legalGuardian.phone);
    this.firstName = TextHelper.titleCase(legalGuardian.firstName);
    this.lastName = TextHelper.titleCase(legalGuardian.lastName);
    this.secondLastName =
      legalGuardian.secondLastName !== null ? TextHelper.titleCase(legalGuardian.secondLastName) : null;
    this.documentNumber = legalGuardian.documentNumber;
    this.documentType = legalGuardian.documentType ? this.ensureDocumentType(legalGuardian.documentType) : undefined;
  }

  private ensureDocumentType(documentType: unknown): PatientDocumentType {
    const values = Object.values(PatientDocumentType);

    if (!values.includes(documentType as PatientDocumentType)) {
      throw ErrorModel.conflict({ detail: ClientErrorMessages.ERROR_PATIENT });
    }

    return documentType as PatientDocumentType;
  }
}
