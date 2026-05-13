import { BaseModel } from 'src/app/entities/models/base.model';
import { PatientReportTypesMapper } from 'src/general/enums/patientReportType.enum';

export class ReportTypeModel extends BaseModel {
  readonly id?: number;
  readonly name?: string;
  readonly resource?: string;
  readonly group?: string;

  constructor(type: string) {
    super();

    const reportType = PatientReportTypesMapper.getReportTypeDto(type);

    this.id = reportType.id;
    this.name = reportType.name;
    this.resource = reportType.resource;
    this.group = reportType.group;
  }
}
