import { randomBytes } from 'crypto';

export class TextHelper {
  static normalizePhoneNumber(phone?: string | null): string | undefined | null {
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

  static generateOtp(length = 5): string {
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
}
