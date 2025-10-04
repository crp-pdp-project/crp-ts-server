import dayjs, { Dayjs, isDayjs, ManipulateType } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { allConstants, dateConstants, dateTimeConstants, timeConstants } from '../contants/date.constants';

dayjs.extend(customParseFormat);

export enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec,
}

export type TimeFormatKey = keyof typeof timeConstants;
export type DateFormatKey = keyof typeof dateConstants;
export type DateTimeFormatKey = keyof typeof dateTimeConstants;
export type FormatKey = keyof typeof allConstants;

export class DateHelper {
  private static readonly allInputFormats: string[] = Object.values(allConstants);

  static toFormatDate(date: string | Date, formatKey: DateFormatKey): string {
    return this.parse(date).format(dateConstants[formatKey]);
  }

  static toFormatTime(date: string | Date, formatKey: TimeFormatKey): string {
    return this.parse(date).format(timeConstants[formatKey]);
  }

  static toFormatDateTime(date: string | Date, formatKey: DateTimeFormatKey): string {
    return this.parse(date).format(dateTimeConstants[formatKey]);
  }

  static checkExpired(date: string | Date): boolean {
    const parsedDate = this.parse(date);
    return parsedDate.isBefore(dayjs());
  }

  static startOfTime(timeFormatKey: TimeFormatKey): string {
    return dayjs().startOf('day').format(allConstants[timeFormatKey]);
  }

  static endOfTime(timeFormatKey: TimeFormatKey): string {
    return dayjs().endOf('day').format(allConstants[timeFormatKey]);
  }

  static toDate(date: string | Date): Dayjs {
    return this.parse(date);
  }

  static dateNow(formatKey: FormatKey): string {
    return dayjs().format(allConstants[formatKey]);
  }

  static addMonths(numOfMonths: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.add(numOfMonths, 'months').format(allConstants[formatKey]);
  }

  static subtractMonths(numOfMonths: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.subtract(numOfMonths, 'months').format(allConstants[formatKey]);
  }

  static addDays(numOfDays: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.add(numOfDays, 'days').format(allConstants[formatKey]);
  }

  static dateRange(year: number, formatKey: FormatKey, month?: Months): { startDate: string; endDate: string } {
    const baseYear = dayjs(`${year}-01-01`);
    const baseDate = month ? baseYear.set('month', month - 1) : baseYear;
    const granularity: dayjs.UnitType = month ? 'month' : 'year';

    const startDate = baseDate.startOf(granularity).subtract(1, 'day').format(allConstants[formatKey]);
    const endDate = baseDate.endOf(granularity).add(1, 'day').format(allConstants[formatKey]);

    return { startDate, endDate };
  }

  static subtractDays(numOfDays: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.subtract(numOfDays, 'days').format(allConstants[formatKey]);
  }

  static addMinutes(numOfMinutes: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.add(numOfMinutes, 'minutes').format(allConstants[formatKey]);
  }

  static subtractMinutes(numOfMinutes: number, formatKey: FormatKey, baseDate?: string | Date): string {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return date.subtract(numOfMinutes, 'minutes').format(allConstants[formatKey]);
  }

  static countFromNow(baseDate: string | Date, granularity: ManipulateType): number {
    const date = baseDate ? this.parse(baseDate) : dayjs();
    return dayjs().diff(date, granularity);
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
