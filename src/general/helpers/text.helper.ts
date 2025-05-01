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

  static generateOtp(length: number = 5): string {
    const max = 10 ** length;
    let randomNumber: number;
    do {
      randomNumber = Math.floor(Math.random() * max);
    } while (randomNumber === 0);

    const otp = randomNumber.toString().padStart(length, '0');
    return otp;
  }
}
