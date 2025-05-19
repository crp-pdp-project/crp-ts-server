import dayjs, { Dayjs, isDayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { allFormats, dateFormats, dateTimeFormats, timeFormats } from '../contants/date.constants';

dayjs.extend(customParseFormat);

export type TimeFormatKey = keyof typeof timeFormats;
export type DateFormatKey = keyof typeof dateFormats;
export type DateTimeFormatKey = keyof typeof dateTimeFormats;
export type FormatKey = keyof typeof allFormats;

export class DateHelper {
  private static readonly allInputFormats: string[] = Object.values(allFormats);

  static toFormatDate(date: string | Date, formatKey: DateFormatKey): string {
    return this.parse(date).format(dateFormats[formatKey]);
  }

  static toFormatTime(date: string | Date, formatKey: TimeFormatKey): string {
    return this.parse(date).format(timeFormats[formatKey]);
  }

  static toFormatDateTime(date: string | Date, formatKey: DateTimeFormatKey): string {
    return this.parse(date).format(dateTimeFormats[formatKey]);
  }

  static tokenRefreshTime(minutes: number): string {
    return dayjs().add(minutes, 'minute').format(dateTimeFormats.dbDateTime);
  }

  static checkExpired(date: string | Date): boolean {
    const parsedDate = this.parse(date);
    return parsedDate.isBefore(dayjs());
  }

  static startOfTime(timeFormatKey: TimeFormatKey): string {
    return dayjs().startOf('day').format(allFormats[timeFormatKey]);
  }

  static endOfTime(timeFormatKey: TimeFormatKey): string {
    return dayjs().endOf('day').format(allFormats[timeFormatKey]);
  }

  static toDate(date: string | Date): Dayjs {
    return this.parse(date);
  }

  static dateNow(formatKey: FormatKey): string {
    return dayjs().format(allFormats[formatKey]);
  }

  static addMonths(numOfMonths: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.add(numOfMonths, 'months').format(allFormats[formatKey]);
  }

  static subtractMonths(numOfMonths: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.subtract(numOfMonths, 'months').format(allFormats[formatKey]);
  }

  static addDays(numOfDays: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.add(numOfDays, 'days').format(allFormats[formatKey]);
  }

  static subtractDays(numOfDays: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.subtract(numOfDays, 'days').format(allFormats[formatKey]);
  }

  private static parse(input: string | Date | Dayjs): Dayjs {
    if (input instanceof Date) {
      return dayjs(input);
    }

    if (isDayjs(input)) {
      return input;
    }

    const parsed = dayjs(input, this.allInputFormats, true);
    return parsed.isValid() ? parsed : dayjs(input);
  }
}
