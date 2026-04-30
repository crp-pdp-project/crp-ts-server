import { DateHelper } from 'src/general/helpers/date.helper';

import type { PatientReportDTO } from '../../dtos/service/patientReport.dto';
import { BaseModel } from '../base.model';

import { PatientReportModel } from './patientReport.model';

export class PatientReportListModel extends BaseModel {
  readonly results: PatientReportModel[];

  constructor(patientResults: PatientReportDTO[]) {
    super();

    this.results = this.generatePatientResults(patientResults);
  }

  private generatePatientResults(patientResults: PatientReportDTO[]): PatientReportModel[] {
    const sortedResults = this.sortPatientResults(patientResults);
    return sortedResults.map((result) => new PatientReportModel(result));
  }

  private sortPatientResults(list: PatientReportDTO[]): PatientReportDTO[] {
    return list.sort((a, b) => {
      const dateA = DateHelper.toDate('none', `${a.date}${DateHelper.toDate('inetumTime', a.time)}`);
      const dateB = DateHelper.toDate('none', `${b.date}${DateHelper.toDate('inetumTime', b.time)}`);

      return dateB.diff(dateA);
    });
  }
}
