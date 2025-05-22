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
    const max = 10 ** length;
    let randomNumber: number;
    do {
      randomNumber = Math.floor(Math.random() * max);
    } while (randomNumber === 0);

    const otp = randomNumber.toString().padStart(length, '0');
    return otp;
  }

  static cleanTextParentheses(text?: string): string | undefined {
    if (!text) return text;

    const cleaned = text.replace(/^(\s*\([^)]+\)\s*)+/, '').trim();
    const match = cleaned.match(/^(.*?)(\s*\([^)]+\))/);

    if(!match) return cleaned;

    const main = match[1].trim();
    const preserved = match[2].replace(/[()]/g, '');

    return preserved ? `${main} - ${preserved}` : main;
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
