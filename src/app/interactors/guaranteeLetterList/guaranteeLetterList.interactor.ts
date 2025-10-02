import { GuaranteeLetterListModel } from 'src/app/entities/models/guaranteeLetter/guaranteeLetterList.model';
import { SignInSessionModel } from 'src/app/entities/models/session/signInSession.model';
import {
  GetGuaranteeLetterRepository,
  IGetGuaranteeLetterRepository,
} from 'src/app/repositories/rest/getGuaranteeLetter.repository';

export interface IGuaranteeLetterListInteractor {
  list(session: SignInSessionModel): Promise<GuaranteeLetterListModel>;
}

export class GuaranteeLetterListInteractor implements IGuaranteeLetterListInteractor {
  constructor(private readonly getGuaranteeLetter: IGetGuaranteeLetterRepository) {}

  async list(session: SignInSessionModel): Promise<GuaranteeLetterListModel> {
    const letterList = await this.getGuaranteeLetter.execute(
      session.patient.documentType,
      session.patient.documentNumber,
    );

    return new GuaranteeLetterListModel(letterList);
  }
}

export class GuaranteeLetterListInteractorBuilder {
  static build(): GuaranteeLetterListInteractor {
    return new GuaranteeLetterListInteractor(new GetGuaranteeLetterRepository());
  }
}
