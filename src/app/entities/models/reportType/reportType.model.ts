import type { ReportTypeDTO } from 'src/app/entities/dtos/service/reportType.dto';
import { BaseModel } from 'src/app/entities/models/base.model';

export class ReportTypeModel extends BaseModel {
  readonly id?: number;
  readonly name?: string;
  readonly group?: string;

  constructor(reportType: ReportTypeDTO) {
    super();

    this.id = reportType.id;
    this.name = reportType.name;
    this.group = reportType.group;
  }
}
