import type { PatientReportDTO } from '../../dtos/service/patientReport.dto';
import { BaseModel } from '../base.model';

import { AppointmentDocumentModel } from './appointmentDocument.model';

export class AppointmentDocumentListModel extends BaseModel {
  readonly documents: AppointmentDocumentModel[];

  constructor(appointmentDocument: PatientReportDTO[]) {
    super();

    this.documents = this.generateAppointmentDocuments(appointmentDocument);
  }

  private generateAppointmentDocuments(appointmentDocument: PatientReportDTO[]): AppointmentDocumentModel[] {
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
