import { BaseModel } from 'src/app/entities/models/base.model';
import { TextHelper } from 'src/general/helpers/text.helper';

import { PatientExternalDTO } from '../dtos/service/patientExternal.dto';

import { PatientModel } from './patient.model';

export class PatientProfileModel extends BaseModel {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly secondLastName: string | null;
  readonly documentNumber: string;
  readonly documentType: number;
  readonly email: string | null;
  readonly maskedEmail: string | null;
  readonly phone: string | null;
  readonly maskedPhone: string | null;

  constructor(patient: PatientModel, external: PatientExternalDTO) {
    super();

    this.id = patient.id ?? 0;
    this.firstName = patient.firstName ?? '';
    this.lastName = patient.lastName ?? '';
    this.secondLastName = patient.secondLastName ?? null;
    this.documentNumber = patient.documentNumber ?? '';
    this.documentType = patient.documentType ?? 0;
    this.email = external.email;
    this.maskedEmail = TextHelper.maskEmail(external.email);
    this.phone = TextHelper.normalizePhoneNumber(external.phone);
    this.maskedPhone = TextHelper.maskPhone(external.phone);
  }
}
