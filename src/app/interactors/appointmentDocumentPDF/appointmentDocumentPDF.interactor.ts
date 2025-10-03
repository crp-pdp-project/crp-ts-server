import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { AppointmentDocumentPDFParamsDTO } from 'src/app/entities/dtos/input/appointmentDocumentPDF.input.dto';
import { PdfFileModel } from 'src/app/entities/models/File/pdfFile.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  IObtainPDFDocumentRepository,
  ObtainPDFDocumentRepository,
} from 'src/app/repositories/soap/obtainPDFDocument.repository';

export interface IAppointmentDocumentPDFInteractor {
  obtain(params: AppointmentDocumentPDFParamsDTO, session: SignInSessionModel): Promise<PdfFileModel>;
}

export class AppointmentDocumentPDFInteractor implements IAppointmentDocumentPDFInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly obtainePdfDocument: IObtainPDFDocumentRepository,
  ) {}

  async obtain(params: AppointmentDocumentPDFParamsDTO, session: SignInSessionModel): Promise<PdfFileModel> {
    await this.validateRelatives(params.fmpId, session);
    const fileModel = await this.getAppointmentDocumentPDF(params);

    return fileModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }

  private async getAppointmentDocumentPDF(params: AppointmentDocumentPDFParamsDTO): Promise<PdfFileModel> {
    const base64 = await this.obtainePdfDocument.execute(params.fmpId, params.documentId);
    const model = PdfFileModel.fromBase64(base64);

    return model;
  }
}

export class AppointmentDocumentPDFInteractorBuilder {
  static build(): AppointmentDocumentPDFInteractor {
    return new AppointmentDocumentPDFInteractor(
      new PatientRelativesValidationRepository(),
      new ObtainPDFDocumentRepository(),
    );
  }
}
