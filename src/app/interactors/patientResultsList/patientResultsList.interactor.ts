import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type {
  PatientResultsListParamsDTO,
  PatientResultsListQueryDTO,
} from 'src/app/entities/dtos/input/patientResultsList.input.dto';
import { PatientReportListModel } from 'src/app/entities/models/patientReport/patientReportList.model';
import type { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import { ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import type { IPatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import { PatientRelativesValidationRepository } from 'src/app/repositories/database/patientRelativesValidation.repository';
import type { IGetPatientResultsRepository } from 'src/app/repositories/soap/getPatientResults.repository';
import { GetPatientResultsRepository } from 'src/app/repositories/soap/getPatientResults.repository';

export interface IPatientResultsListInteractor {
  list(
    params: PatientResultsListParamsDTO,
    query: PatientResultsListQueryDTO,
    session: SignInSessionModel,
  ): Promise<PatientReportListModel>;
}

export class PatientResultsListInteractor implements IPatientResultsListInteractor {
  constructor(
    private readonly getPatientResults: IGetPatientResultsRepository,
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
  ) {}

  async list(
    params: PatientResultsListParamsDTO,
    query: PatientResultsListQueryDTO,
    session: SignInSessionModel,
  ): Promise<PatientReportListModel> {
    await this.validateRelatives(params.fmpId, session);
    const resultsList = await this.getPatientResults.execute({
      fmpId: params.fmpId,
      year: query.year,
      month: query.month,
    });

    return new PatientReportListModel(resultsList);
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }
}

export class PatientResultsListInteractorBuilder {
  static build(): PatientResultsListInteractor {
    return new PatientResultsListInteractor(
      new GetPatientResultsRepository(),
      new PatientRelativesValidationRepository(),
    );
  }
}
