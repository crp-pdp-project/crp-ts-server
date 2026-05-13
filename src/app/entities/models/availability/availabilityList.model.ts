import type { DoctorAvailabilityDTO } from 'src/app/entities/dtos/service/doctorAvailability.dto';
import { AvailabilityFilters } from 'src/general/enums/availabilityFilters.enum';
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

  constructor(availability: DoctorAvailabilityDTO[], filter: AvailabilityFilters) {
    super();

    this.availability = this.resolveDatesArray(availability, filter);
  }

  private resolveDatesArray(availability: DoctorAvailabilityDTO[], filter: AvailabilityFilters): AvailabilityDate[] {
    const map = new Map<string, AvailabilityTime[]>();

    availability.forEach((slot) => {
      const { date, time, scheduleId, blockId } = slot;

      const formattedTime = DateHelper.toDate('spanishDateTime', `${date}${time}`);

      const entry = map.get(date) ?? [];
      entry.push({ time: formattedTime, scheduleId, blockId });
      map.set(date, entry);
    });

    const sortedDates = Array.from(map.entries()).sort(([a], [b]) => this.sortAscByDate(a, b));
    const filteredDates = this.filterDatesByType(sortedDates, filter);

    return filteredDates.map(([date, slots]) => ({
      date: DateHelper.toDate('spanishDate', date),
      slots: [...slots].sort((a, b) => this.sortAscByDate(a.time, b.time)),
    }));
  }

  private filterDatesByType(
    availability: [string, AvailabilityTime[]][],
    filter: AvailabilityFilters,
  ): [string, AvailabilityTime[]][] {
    if (availability.length === 0) {
      return availability;
    }

    switch (filter) {
      case AvailabilityFilters.MONTH: {
        const monthEnd = DateHelper.endOf('none', 'month', availability[0][0]);
        return availability.filter(([date]) => !DateHelper.isAfter(date, monthEnd));
      }
      case AvailabilityFilters.ALL:
      default:
        return availability;
    }
  }

  private sortAscByDate(aDate: string, bDate: string): number {
    const a = DateHelper.toDate('none', aDate);
    const b = DateHelper.toDate('none', bDate);
    return a.diff(b);
  }
}
