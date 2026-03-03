import type { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import { DateHelper } from 'src/general/helpers/date.helper';

import { BaseModel } from '../base.model';

type AvailabilityTime = {
  time: string;
  scheduleId: string;
  blockId: string;
};

type AvailabilityDate = {
  date: string;
  slots: AvailabilityTime[];
};

export class AvailabilityListModel extends BaseModel {
  readonly availability: AvailabilityDate[];

  constructor(availability: DoctorAvailabilityDTO[]) {
    super();

    this.availability = this.resolveDatesArray(availability);
  }

  private resolveDatesArray(availability: DoctorAvailabilityDTO[]): AvailabilityDate[] {
    const map = new Map<string, AvailabilityTime[]>();

    availability.forEach((slot) => {
      const { date, time, scheduleId, blockId } = slot;

      const formattedTime = DateHelper.toDate('spanishDateTime', `${date}${time}`);

      const entry = map.get(date) ?? [];
      entry.push({ time: formattedTime, scheduleId, blockId });
      map.set(date, entry);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => this.sortAscByDate(a, b))
      .map(([date, slots]) => ({
        date: DateHelper.toDate('spanishDate', date),
        slots: [...slots].sort((a, b) => this.sortAscByDate(a.time, b.time)),
      }));
  }

  private sortAscByDate(aDate: string, bDate: string): number {
    const a = DateHelper.toDate('none', aDate);
    const b = DateHelper.toDate('none', bDate);
    return a.diff(b);
  }
}
