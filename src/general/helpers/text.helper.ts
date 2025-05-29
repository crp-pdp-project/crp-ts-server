import { randomBytes } from 'crypto';

export class TextHelper {
  static normalizePhoneNumber(phone?: string | null): string | null {
    if (!phone) return null;

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

  static cleanTextParentheses(text?: string): string | undefined {
    if (!text) return undefined;

    let i = 0;
    while (i < text.length) {
      const trimmed = text.slice(i).trimStart();
      if (!trimmed.startsWith('(')) break;

      const start = i + text.slice(i).indexOf('(');
      const end = text.indexOf(')', start + 1);
      if (end === -1) break;

      i = end + 1;
    }

    const cleaned = text.slice(i).trim();

    const open = cleaned.lastIndexOf('(');
    const close = cleaned.lastIndexOf(')');

    const isSuffix = open !== -1 && close === cleaned.length - 1 && !cleaned.slice(open + 1, close).includes('(');

    if (!isSuffix) return cleaned;

    const main = cleaned.slice(0, open).trim();
    const suffix = cleaned.slice(open + 1, close).trim();

    return suffix ? `${main} - ${suffix}` : main;
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

  static maskPhone(phone: string | null): string | null {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return '*'.repeat(digits.length);

    const mask = '*'.repeat(digits.length - 3);
    const last = digits.slice(-3);

    return `${mask}${last}`;
  }

  static maskEmail(email: string | null): string | null {
    if (!email) return email;
    const [name, domain] = email.split('@');

    if (name.length <= 3) return `${'*'.repeat(name.length)}@${domain}`;

    const mask = '*'.repeat(name.length - 3);
    const last = name.slice(-3);

    return `${mask}${last}@${domain}`;
  }
}
