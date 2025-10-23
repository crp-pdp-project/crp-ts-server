import { randomBytes, randomUUID } from 'crypto';

export class TextHelper {
  static addCityCode(phone?: string | null): string | undefined | null {
    if (!phone) return phone;

    const digits = phone.replace(/\D/g, '');
    const cleaned = digits.replace(/^0+/, '');

    switch (true) {
      case cleaned.startsWith('511'):
        return `+51${cleaned.slice(3)}`;
      case cleaned.startsWith('51'):
        return `+${cleaned}`;
      default:
        return `+51${cleaned}`;
    }
  }

  static normalizePhoneNumber(phone?: string | null): string | undefined | null {
    if (!phone) return phone;

    const digits = phone.replace(/\D/g, '');
    const cleaned = digits.replace(/^0+/, '');

    switch (true) {
      case cleaned.startsWith('511'):
        return cleaned.slice(3);
      case cleaned.startsWith('51'):
        return cleaned.slice(2);
      default:
        return cleaned;
    }
  }

  static normalizeHost(host?: string): string | undefined {
    const baseDomain = this.normalizeDomain(host);
    if (baseDomain == null) return baseDomain;

    return `https://${baseDomain}`;
  }

  static normalizeDomain(host?: string): string | undefined {
    let value = host?.trim()?.toLowerCase();
    if (!value) return undefined;

    switch (true) {
      case value.startsWith('//'):
        value = value.slice(2);
        break;
      case value.startsWith('http://'):
        value = value.slice(7);
        break;
      case value.startsWith('https://'):
        value = value.slice(8);
        break;
    }

    while (value.length > 0 && value[value.length - 1] === '/') {
      value = value.slice(0, -1);
    }

    return value;
  }

  static normalizeAppointmentId(appointmentId: string): string {
    const cleaned = appointmentId.toUpperCase().startsWith('C') ? appointmentId : `C${appointmentId}`;
    return cleaned;
  }

  static normalizeAppointmentTypeId(appointmentTypeId: string, specialtyId: string): string {
    const cleaned = appointmentTypeId.includes('-') ? appointmentTypeId : `${specialtyId}-${appointmentTypeId}`;
    return cleaned;
  }

  static generateUniqueCode(length = 5): string {
    const charset = '0123456789';
    let otp = '';

    while (otp.length < length) {
      const byte = randomBytes(1)[0];
      const digitIndex = byte % charset.length;

      if (byte >= 250) continue;

      otp += charset[digitIndex];
    }

    return otp;
  }

  static padTextLength(text: string | number, length = 9, char = '0'): string {
    if (String(text).length >= length) return String(text);

    const pad = char.repeat(length);
    const paddedText = `${pad}${text}`;

    return paddedText.slice(-length);
  }

  static titleCase(text?: string): string | undefined {
    if (!text) return text;

    const properText = text
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return properText;
  }

  static maskPhone(phone?: string | null): string | undefined | null {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return '*'.repeat(digits.length);

    const mask = '*'.repeat(digits.length - 3);
    const last = digits.slice(-3);

    return `${mask}${last}`;
  }

  static maskEmail(email?: string | null): string | undefined | null {
    if (!email) return email;
    const [name, domain] = email.split('@');

    if (name.length <= 3) return `${'*'.repeat(name.length)}@${domain}`;

    const mask = '*'.repeat(name.length - 3);
    const last = name.slice(-3);

    return `${mask}${last}@${domain}`;
  }

  static genUniqueName(): string {
    return randomUUID();
  }
}
