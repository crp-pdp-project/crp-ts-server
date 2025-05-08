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
    this.maskedEmail = this.maskEmail(external.email);
    this.phone = TextHelper.normalizePhoneNumber(external.phone);
    this.maskedPhone = this.maskPhone(external.phone);
  }

  private maskPhone(phone: string | null): string | null {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return '*'.repeat(digits.length);

    const mask = '*'.repeat(digits.length - 3);
    const last = digits.slice(-3);

    return `${mask}${last}`;
  }

  private maskEmail(email: string | null): string | null {
    if (!email) return email;
    const [name, domain] = email.split('@');

    if (name.length <= 3) return `${'*'.repeat(name.length)}@${domain}`;

    const mask = '*'.repeat(name.length - 3);
    const last = name.slice(-3);

    return `${mask}${last}@${domain}`;
  }
}
