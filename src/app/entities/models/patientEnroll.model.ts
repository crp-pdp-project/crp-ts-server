import { SessionPayloadDTO } from 'src/app/entities/dtos/service/sessionPayload.dto';
import { BaseModel } from 'src/app/entities/models/base.model';

export class PatientEnrollModel extends BaseModel {
  readonly id: number;
  readonly email: string | null;
  readonly maskedEmail: string | null;
  readonly phone: string | null;
  readonly maskedPhone: string | null;

  constructor(id: number, email: string | null, phone: string | null) {
    super();

    this.id = id;
    this.email = email;
    this.maskedEmail = this.maskEmail(email);
    this.phone = phone;
    this.maskedPhone = this.maskPhone(phone);
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
      id: this.id,
      email: this.email,
      phone: this.phone,
    };
  }
}
