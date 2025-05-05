import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';
import { TextHelper } from 'src/general/helpers/text.helper';

import { PatientExternalDTO } from '../dtos/service/patientExternal.dto';

export class PatientRecoverModel extends BaseModel {
  readonly id: number;
  readonly email: string | null;
  readonly maskedEmail: string | null;
  readonly phone: string | null;
  readonly maskedPhone: string | null;

  constructor(patientId: number, patient: PatientExternalDTO) {
    super();

    this.id = patientId;
    this.email = patient.email;
    this.maskedEmail = this.maskEmail(patient.email);
    this.phone = TextHelper.normalizePhoneNumber(patient.phone);
    this.maskedPhone = this.maskPhone(patient.phone);
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

  toSessionPayload(): SessionPayloadDTO {
    return {
      email: this.email,
      phone: this.phone,
    };
  }
}
