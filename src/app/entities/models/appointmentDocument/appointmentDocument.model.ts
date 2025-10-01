import {
  AppointmentDocumentCategoriesMapper,
  AppointmentDocumentIcon,
  AppointmentDocumentTitle,
} from 'src/general/enums/appointmentDocumentCategories.enum';

import { AppointmentDocumentDTO } from '../../dtos/service/appointmentDocument.dto';
import { BaseModel } from '../base.model';

export class AppointmentDocumentModel extends BaseModel {
  readonly documentId?: string;
  readonly title?: AppointmentDocumentTitle;
  readonly icon?: AppointmentDocumentIcon;

  constructor(appointmentDocument: AppointmentDocumentDTO) {
    super();

    this.documentId = appointmentDocument.documentId;
    this.title = AppointmentDocumentCategoriesMapper.getAppointmentDocumentTitle(appointmentDocument.documentCategory);
    this.icon = AppointmentDocumentCategoriesMapper.getAppointmentDocumentIcon(appointmentDocument.documentCategory);
  }

  isMappable(): boolean {
    return this.title != null && this.icon != null;
  }
}
