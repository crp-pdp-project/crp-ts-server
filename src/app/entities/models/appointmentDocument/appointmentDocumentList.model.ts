import { AppointmentDocumentDTO } from '../../dtos/service/appointmentDocument.dto';
import { BaseModel } from '../base.model';

import { AppointmentDocumentModel } from './appointmentDocument.model';

export class AppointmentDocumentListModel extends BaseModel {
  readonly documents: AppointmentDocumentModel[];

  constructor(appointmentDocument: AppointmentDocumentDTO[]) {
    super();

    this.documents = this.generateAppointmentDocuments(appointmentDocument);
  }

  private generateAppointmentDocuments(appointmentDocument: AppointmentDocumentDTO[]): AppointmentDocumentModel[] {
    const documents: AppointmentDocumentModel[] = [];

    appointmentDocument.forEach((document) => {
      const instance = new AppointmentDocumentModel(document);
      if (instance.isMappable()) {
        documents.push(instance);
      }
    });

    return documents;
  }
}
