import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export class DateHelper {
  private static readonly standardTime: string = 'HH:mm:ss';

  private static readonly spanishDate: string = 'DD-MM-YYYY';
  private static readonly spanishDateTime: string = `${this.spanishDate} ${this.standardTime}`;

  private static readonly dbDate: string = 'YYYY-MM-DD';
  private static readonly dbDateTime: string = `${this.dbDate} ${this.standardTime}`;

  private static readonly inetumDate: string = 'YYYYMMDD';
  private static readonly inetumTime: string = 'HHmmss';

  private static readonly timeFormats: string[] = [this.standardTime, this.inetumTime];
  private static readonly dateFormats: string[] = [this.spanishDate, this.dbDate, this.inetumDate];
  private static readonly dateTimeFormats: string[] = [this.spanishDateTime, this.dbDateTime];

  private static parse(input: string | Date, formats: string[]): Dayjs {
    const date = dayjs(input);

    if (date.isValid()) {
      return date;
    }

    return dayjs(input, formats);
  }

  static toInetumDate(date: string | Date): string {
    return this.parse(date, this.dateFormats).format(this.inetumDate);
  }

  static toInetumTime(time: string | Date): string {
    return this.parse(time, this.timeFormats).format(this.inetumTime);
  }

  static toSpanishDate(date: string | Date): string {
    return this.parse(date, this.dateFormats).format(this.inetumDate);
  }

  static toSpanishTime(time: string | Date): string {
    return this.parse(time, this.timeFormats).format(this.inetumTime);
  }

  static toDbDate(date: string | Date): string {
    return this.parse(date, this.dateFormats).format(this.inetumDate);
  }

  static toDbTime(time: string | Date): string {
    return this.parse(time, this.timeFormats).format(this.inetumTime);
  }

  static tokenRefreshTime(minutes: number): string {
    return dayjs().add(minutes, 'minute').format(`${this.dbDate} ${this.standardTime}`);
  }

  static checkExpired(date: string | Date): boolean {
    const parsedDate = this.parse(date, [...this.dateFormats, ...this.timeFormats, ...this.dateTimeFormats]);
    return parsedDate.isBefore(dayjs());
  }
}
