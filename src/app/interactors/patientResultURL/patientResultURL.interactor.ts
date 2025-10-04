import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { PatientResultURLParamsDTO } from 'src/app/entities/dtos/input/patientResultURL.input.dto';
import { PatientResultURLModel } from 'src/app/entities/models/patientResult/patientResultURL.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import { GetResultsURLRepository, IGetResultsURLRepository } from 'src/app/repositories/rest/getResultsURL.respository';

export interface IPatientResultURLInteractor {
  obtain(params: PatientResultURLParamsDTO, session: SignInSessionModel): Promise<PatientResultURLModel>;
}

export class PatientResultURLInteractor implements IPatientResultURLInteractor {
  constructor(
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
    private readonly getResultsURL: IGetResultsURLRepository,
  ) {}

  async obtain(params: PatientResultURLParamsDTO, session: SignInSessionModel): Promise<PatientResultURLModel> {
    await this.validateRelatives(params.fmpId, session);
    const patientModel = session.getPatient(params.fmpId);
    const urlModel = await this.getPatientResultURL(params.accessNumber, patientModel.nhcId!);

    return urlModel;
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }

  private async getPatientResultURL(accessNumber: string, nhcId: PatientDM['nhcId']): Promise<PatientResultURLModel> {
    const url = await this.getResultsURL.execute(accessNumber, nhcId);

    return new PatientResultURLModel(url);
  }
}

export class PatientResultURLInteractorBuilder {
  static build(): PatientResultURLInteractor {
    return new PatientResultURLInteractor(new PatientRelativesValidationRepository(), new GetResultsURLRepository());
  }
}
