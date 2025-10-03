import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { GuaranteeLetterListParamsDTO } from 'src/app/entities/dtos/input/guaranteeLetterList.input.dto';
import { GuaranteeLetterListModel } from 'src/app/entities/models/guaranteeLetter/guaranteeLetterList.model';
import { SignInSessionModel, ValidationRules } from 'src/app/entities/models/session/signInSession.model';
import {
  IPatientRelativesValidationRepository,
  PatientRelativesValidationRepository,
} from 'src/app/repositories/database/patientRelativesValidation.repository';
import {
  GetGuaranteeLetterRepository,
  IGetGuaranteeLetterRepository,
} from 'src/app/repositories/rest/getGuaranteeLetter.repository';

export interface IGuaranteeLetterListInteractor {
  list(params: GuaranteeLetterListParamsDTO, session: SignInSessionModel): Promise<GuaranteeLetterListModel>;
}

export class GuaranteeLetterListInteractor implements IGuaranteeLetterListInteractor {
  constructor(
    private readonly getGuaranteeLetter: IGetGuaranteeLetterRepository,
    private readonly patientRelativesValidation: IPatientRelativesValidationRepository,
  ) {}

  async list(params: GuaranteeLetterListParamsDTO, session: SignInSessionModel): Promise<GuaranteeLetterListModel> {
    await this.validateRelatives(params.fmpId, session);
    const patient = session.getPatient(params.fmpId);
    const letterList = await this.getGuaranteeLetter.execute(patient.documentType!, patient.documentNumber!);

    return new GuaranteeLetterListModel(letterList);
  }

  private async validateRelatives(fmpId: PatientDM['fmpId'], session: SignInSessionModel): Promise<void> {
    const relatives = await this.patientRelativesValidation.execute(session.patient.id);
    session.inyectRelatives(relatives).validateFmpId(fmpId, ValidationRules.SELF_OR_DEPENDANTS);
  }
}

export class GuaranteeLetterListInteractorBuilder {
  static build(): GuaranteeLetterListInteractor {
    return new GuaranteeLetterListInteractor(
      new GetGuaranteeLetterRepository(),
      new PatientRelativesValidationRepository(),
    );
  }
}
