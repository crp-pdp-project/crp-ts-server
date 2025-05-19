import { FastifyRequest } from 'fastify';

import { InsuranceDTO } from 'src/app/entities/dtos/service/insurance.dto';
import { ErrorModel } from 'src/app/entities/models/error.model';
import { InsuranceListModel } from 'src/app/entities/models/insuranceList.model';
import { SessionModel } from 'src/app/entities/models/session.model';
import { SignInSessionModel } from 'src/app/entities/models/signInSession.model';
import { IGetInsurancesRepository } from 'src/app/repositories/soap/getInsurances.repository';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';

export interface IInsurancesListInteractor {
  list(input: FastifyRequest): Promise<InsuranceListModel | ErrorModel>;
}

export class InsurancesListInteractor implements IInsurancesListInteractor {
  constructor(private readonly getInsurances: IGetInsurancesRepository) {}

  async list(input: FastifyRequest): Promise<InsuranceListModel | ErrorModel> {
    try {
      this.validateSession(input.session);
      const insurancesList = await this.getInsurancesList();
      return new InsuranceListModel(insurancesList);
    } catch (error) {
      return ErrorModel.fromError(error);
    }
  }

  private validateSession(session?: SessionModel): void {
    if (!(session instanceof SignInSessionModel)) {
      throw ErrorModel.forbidden(ClientErrorMessages.JWE_TOKEN_INVALID);
    }
  }

  private async getInsurancesList(): Promise<InsuranceDTO[]> {
    const insurancesList = await this.getInsurances.execute();

    return insurancesList;
  }
}
