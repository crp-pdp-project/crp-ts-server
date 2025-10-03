import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientResultPDFParamsDTO } from 'src/app/entities/dtos/input/patientResultPDF.input.dto';
import { PdfFileModel } from 'src/app/entities/models/File/pdfFile.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetResultPDFRepository, IGetResultPDFRepository } from 'src/app/repositories/rest/getResultsPDF.repository';

export interface IPatientResultPDFInteractor {
  obtain(params: PatientResultPDFParamsDTO, session: SignInSessionModel): Promise<PdfFileModel>;
}

export class PatientResultPDFInteractor implements IPatientResultPDFInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getResultPDF: IGetResultPDFRepository,
  ) {}

  async obtain(params: PatientResultPDFParamsDTO, session: SignInSessionModel): Promise<PdfFileModel> {
    await this.validateRelatives(params.fmpId, session);
    const fileModel = await this.getPatientResultPDF(params);

    return fileModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }

  private async getPatientResultPDF(params: PatientResultPDFParamsDTO): Promise<PdfFileModel> {
    const buffer = await this.getResultPDF.execute(params.resultId);
    const model = PdfFileModel.fromBuffer(buffer);

    return model;
  }
}

export class PatientResultPDFInteractorBuilder {
  static build(): PatientResultPDFInteractor {
    return new PatientResultPDFInteractor(new PatientRelativesValidationRepository(), new GetResultPDFRepository());
  }
}
