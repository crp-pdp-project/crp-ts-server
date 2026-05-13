import { DateHelper } from 'src/general/helpers/date.helper';

import type { PatientReportDTO } from '../../dtos/service/patientReport.dto';
import { BaseModel } from '../base.model';

import { PatientReportModel } from './patientReport.model';

export class PatientReportListModel extends BaseModel {
  readonly reports: PatientReportModel[];

  constructor(patientReports: PatientReportDTO[]) {
    super();

    this.reports = this.generatePatientReports(patientReports);
  }

  private generatePatientReports(patientReports: PatientReportDTO[]): PatientReportModel[] {
    const sortedReports = this.sortPatientReports(patientReports);
    return sortedReports.map((result) => new PatientReportModel(result));
  }

  private sortPatientReports(list: PatientReportDTO[]): PatientReportDTO[] {
    return list.sort((a, b) => {
      const dateA = DateHelper.toDate('none', `${a.date}${DateHelper.toDate('inetumTime', a.time)}`);
      const dateB = DateHelper.toDate('none', `${b.date}${DateHelper.toDate('inetumTime', b.time)}`);

      return dateB.diff(dateA);
    });
  }
}
