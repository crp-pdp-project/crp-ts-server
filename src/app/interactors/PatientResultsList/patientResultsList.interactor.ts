import { PatientDM } from 'src/app/entities/dms/patients.dm';
import {
  PatientResultsListParamsDTO,
  PatientResultsListQueryDTO,
} from 'src/app/entities/dtos/input/patientResultsList.input.dto';
import { PatientResultListModel } from 'src/app/entities/models/patientResult/patientResultList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetPatientResultsRepository,
  IGetPatientResultsRepository,
} from 'src/app/repositories/soap/getPatientResults.repository';

export interface IPatientResultsListInteractor {
  list(
    params: PatientResultsListParamsDTO,
    query: PatientResultsListQueryDTO,
    session: SignInSessionModel,
  ): Promise<PatientResultListModel>;
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
  ): Promise<PatientResultListModel> {
    await this.validateRelatives(params.fmpId, session);
    const resultsList = await this.getPatientResults.execute(params.fmpId, query.year, query.month);

    return new PatientResultListModel(resultsList);
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
