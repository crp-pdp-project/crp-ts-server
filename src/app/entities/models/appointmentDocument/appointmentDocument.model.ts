import type {
  AppointmentDocumentIcon,
  AppointmentDocumentTitle,
} from 'src/general/enums/appointmentDocumentCategories.enum';
import { AppointmentDocumentCategoriesMapper } from 'src/general/enums/appointmentDocumentCategories.enum';

import type { PatientReportDTO } from '../../dtos/service/patientReport.dto';
import { BaseModel } from '../base.model';

export class AppointmentDocumentModel extends BaseModel {
  readonly documentId?: string;
  readonly title?: AppointmentDocumentTitle;
  readonly icon?: AppointmentDocumentIcon;

  constructor(patientReport: PatientReportDTO) {
    super();

    this.documentId = patientReport.documentId;
    this.title = AppointmentDocumentCategoriesMapper.getAppointmentDocumentTitle(patientReport.documentCategory);
    this.icon = AppointmentDocumentCategoriesMapper.getAppointmentDocumentIcon(patientReport.documentCategory);
  }

  isMappable(): boolean {
    return this.title != null && this.icon != null;
  }
}
