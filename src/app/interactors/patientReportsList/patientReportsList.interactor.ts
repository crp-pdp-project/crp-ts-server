import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type {
  PatientReportsListParamsDTO,
  PatientReportsListQueryDTO,
} from 'src/app/entities/dtos/input/patientReportsList.input.dto';
import { PatientReportListModel } from 'src/app/entities/models/patientReport/patientReportList.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import type { IGetPatientDocumentsRepository } from 'src/app/repositories/soap/getPatientDocuments.repository';
import { GetPatientDocumentsRepository } from 'src/app/repositories/soap/getPatientDocuments.repository';
import type { IGetPatientResultsRepository } from 'src/app/repositories/soap/getPatientResults.repository';
import { GetPatientResultsRepository } from 'src/app/repositories/soap/getPatientResults.repository';
import { PatientReportGroup } from 'src/general/enums/patientReportType.enum';

export interface IPatientReportsListInteractor {
  list(
    params: PatientReportsListParamsDTO,
    query: PatientReportsListQueryDTO,
    session: SignInSessionModel,
  ): Promise<PatientReportListModel>;
}

export class PatientReportsListInteractor implements IPatientReportsListInteractor {
  constructor(
    private readonly getPatientResults: IGetPatientResultsRepository,
    private readonly getPatientDocuments: IGetPatientDocumentsRepository,
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
  ) {}

  async list(
    params: PatientReportsListParamsDTO,
    query: PatientReportsListQueryDTO,
    session: SignInSessionModel,
  ): Promise<PatientReportListModel> {
    await this.validateRelatives(params.fmpId, session);
    const reportListModel = await this.getReports(params.fmpId, query);

    return reportListModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }

  private async getReports(
    fmpId: PatientDM['fmpId'],
    query: PatientReportsListQueryDTO,
  ): Promise<PatientReportListModel> {
    const { group, year, month } = query;
    const payload = { fmpId, year, month };
    const repositoriesByGroup = {
      [PatientReportGroup.DOCUMENTS]: [this.getPatientDocuments],
      [PatientReportGroup.RESULTS]: [this.getPatientResults],
      [PatientReportGroup.ALL]: [this.getPatientDocuments, this.getPatientResults],
    };

    const reports = await Promise.all(repositoriesByGroup[group].map((repository) => repository.execute(payload)));

    return new PatientReportListModel(reports.flat());
  }
}

export class PatientReportsListInteractorBuilder {
  static build(): PatientReportsListInteractor {
    return new PatientReportsListInteractor(
      new GetPatientResultsRepository(),
      new GetPatientDocumentsRepository(),
      new PatientRelativesValidationRepository(),
    );
  }
}
