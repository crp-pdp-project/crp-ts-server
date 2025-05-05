import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const timeFormats = {
  spanishTime: 'HH:mm:ss',
  dbTime: 'HH:mm:ss',
  inetumTime: 'HHmmss',
} as const;
const dateFormats = {
  spanishDate: 'DD-MM-YYYY',
  dbDate: 'YYYY-MM-DD',
  inetumDate: 'YYYYMMDD',
} as const;
const dateTimeFormats = {
  spanishDateTime: 'DD-MM-YYYY HH:mm:ss',
  dbDateTime: 'YYYY-MM-DD HH:mm:ss',
  inetumDateTime: 'YYYYMMDDHHmmss',
} as const;
const allFormats = {
  ...timeFormats,
  ...dateFormats,
  ...dateTimeFormats,
} as const;

export type TimeFormatKey = keyof typeof timeFormats;
export type DateFormatKey = keyof typeof dateFormats;
export type DateTimeFormatKey = keyof typeof dateTimeFormats;
export type FormatKey = keyof typeof allFormats;

export class DateHelper {
  private static readonly timeInputFormats: string[] = Object.values(timeFormats);
  private static readonly dateInputFormats: string[] = Object.values(dateFormats);
  private static readonly dateTimeInputFormats: string[] = Object.values(dateTimeFormats);
  private static readonly allInputFormats: string[] = Object.values(allFormats);

  static toFormatDate(date: string | Date, formatKey: DateFormatKey): string {
    return this.parse(date, this.dateInputFormats).format(dateFormats[formatKey]);
  }

  static toFormatTime(date: string | Date, formatKey: TimeFormatKey): string {
    return this.parse(date, this.timeInputFormats).format(timeFormats[formatKey]);
  }

  static toFormatDateTime(date: string | Date, formatKey: DateTimeFormatKey): string {
    return this.parse(date, this.dateTimeInputFormats).format(dateTimeFormats[formatKey]);
  }

  static tokenRefreshTime(minutes: number): string {
    return dayjs().add(minutes, 'minute').format(dateTimeFormats.dbDateTime);
  }

  static checkExpired(date: string | Date): boolean {
    const parsedDate = this.parse(date, this.allInputFormats);
    return parsedDate.isBefore(dayjs());
  }

  static subtractMonths(numOfMonths: number, formatKey: FormatKey): string {
    return dayjs().subtract(numOfMonths, 'months').format(allFormats[formatKey]);
  }

  static currentDate(formatKey: FormatKey): string {
    return dayjs().format(allFormats[formatKey]);
  }

  private static parse(input: string | Date, formats: string[]): Dayjs {
    const date = dayjs(input);
    return date.isValid() ? date : dayjs(input, formats);
  }
}
