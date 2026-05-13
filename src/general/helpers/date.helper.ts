import dayjs, { isDayjs, extend } from 'dayjs';
import type { Dayjs, ManipulateType, UnitType } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { allConstants } from '../contants/date.constants';

extend(customParseFormat);

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

export type NullKey = 'none';
export type FormatKey = keyof typeof allConstants;
export type AnyFormatKey = FormatKey | NullKey;
export type ValidDate = Dayjs | Date | string | number;
export type FormatResult<T extends AnyFormatKey> = T extends NullKey ? Dayjs : string;

export class DateHelper {
  private static readonly allInputFormats: string[] = Object.values(allConstants);

  static toDate<T extends AnyFormatKey>(formatKey: T, date?: ValidDate): FormatResult<T> {
    const parsedDate = this.parse(date);
    return this.format(formatKey, parsedDate);
  }

  static startOf<T extends AnyFormatKey>(formatKey: T, granularity: UnitType, date?: ValidDate): FormatResult<T> {
    const parsedDate = this.parse(date).startOf(granularity);
    return this.format(formatKey, parsedDate);
  }

  static endOf<T extends AnyFormatKey>(formatKey: T, granularity: UnitType, date?: ValidDate): FormatResult<T> {
    const parsedDate = this.parse(date).endOf(granularity);
    return this.format(formatKey, parsedDate);
  }

  static toRange<T extends AnyFormatKey>(
    formatKey: T,
    granularity: UnitType,
    date?: ValidDate,
  ): { start: FormatResult<T>; end: FormatResult<T> } {
    return {
      start: this.startOf(formatKey, granularity, date),
      end: this.endOf(formatKey, granularity, date),
    };
  }

  static mutate<T extends AnyFormatKey>(
    formatKey: T,
    granularity: ManipulateType,
    amount: number,
    date?: ValidDate,
  ): FormatResult<T> {
    const parsedDate = this.parse(date).add(amount, granularity);
    return this.format(formatKey, parsedDate);
  }

  static parseSplitDate<T extends AnyFormatKey>(
    formatKey: T,
    year: number,
    month?: Months,
    day?: number,
  ): FormatResult<T> {
    const parsedDate = dayjs()
      .set('year', year)
      .set('month', month ? month - 1 : 0)
      .set('date', day ?? 1);
    return this.format(formatKey, parsedDate);
  }

  static countFrom(granularity: ManipulateType, date?: ValidDate, fromDate?: ValidDate): number {
    return this.parse(fromDate).diff(this.parse(date), granularity) + 1;
  }

  static isBefore(date?: ValidDate, compareTo?: ValidDate): boolean {
    return this.parse(date).isBefore(this.parse(compareTo));
  }

  static isAfter(date?: ValidDate, compareTo?: ValidDate): boolean {
    return this.parse(date).isAfter(this.parse(compareTo));
  }

  private static parse(input?: ValidDate): Dayjs {
    if (!input) {
      return dayjs();
    }

    if (input instanceof Date || typeof input === 'number') {
      return dayjs(input);
    }

    if (isDayjs(input)) {
      return input;
    }

    const parsed = dayjs(input, this.allInputFormats, true);

    return parsed.isValid() ? parsed : dayjs(input);
  }

  private static isFormatKey(formatKey: AnyFormatKey): formatKey is FormatKey {
    return formatKey !== 'none';
  }

  private static format<T extends AnyFormatKey>(formatKey: T, date: Dayjs): FormatResult<T> {
    return (this.isFormatKey(formatKey) ? date.format(allConstants[formatKey]) : date) as FormatResult<T>;
  }
}
